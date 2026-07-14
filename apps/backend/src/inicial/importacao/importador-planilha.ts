import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DetalheLinhaImportacaoDTO,
  ImportarInicialResponseDTO,
} from '../dto/importar-inicial.dto';

type Linha = Record<string, string>;

/**
 * Importa processos com histórico completo a partir de uma planilha .xlsx
 * multi-abas (Processos + entidades-filhas ligadas pelo SEI). Não-destrutivo:
 * adiciona processos novos; SEIs já existentes são ignorados (duplicados).
 * Cada processo é criado numa transação própria.
 */
export class ImportadorPlanilha {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------------- helpers

  private valorCelula(cell: ExcelJS.Cell | undefined): string {
    if (!cell) return '';
    const v = cell.value as unknown;
    if (v == null) return '';
    if (v instanceof Date) {
      const y = v.getUTCFullYear();
      const m = String(v.getUTCMonth() + 1).padStart(2, '0');
      const d = String(v.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    if (typeof v === 'object') {
      const obj = v as {
        text?: string;
        result?: unknown;
        richText?: { text: string }[];
      };
      if (Array.isArray(obj.richText))
        return obj.richText.map((r) => r.text).join('').trim();
      if (obj.text != null) return String(obj.text).trim();
      if (obj.result != null) return String(obj.result).trim();
      return '';
    }
    return String(v).trim();
  }

  private ehSim(valor?: string): boolean {
    return ['SIM', 'S', 'YES', 'TRUE', '1'].includes(
      (valor ?? '').trim().toUpperCase(),
    );
  }

  private data(valor?: string): Date | undefined {
    const texto = (valor ?? '').trim();
    if (!texto) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto))
      return new Date(`${texto}T12:00:00.000Z`);
    const br = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (br) {
      const [, d, m, y] = br;
      return new Date(
        `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T12:00:00.000Z`,
      );
    }
    const dt = new Date(texto);
    if (Number.isNaN(dt.getTime())) throw new Error(`Data inválida: "${texto}".`);
    return dt;
  }

  private int(valor?: string): number | undefined {
    const texto = (valor ?? '').trim();
    if (texto === '') return undefined;
    const n = Number(texto);
    return Number.isNaN(n) ? undefined : n;
  }

  private semMascara(valor?: string): string {
    return (valor ?? '').replace(/\D/g, '');
  }

  private tipoProcesso(valor?: string): number {
    const t = (valor ?? '').trim().toLowerCase();
    if (t.includes('grapro')) return 2;
    if (t.includes('smul') || t.includes('próprio') || t.includes('proprio'))
      return 1;
    return Number(t) === 2 ? 2 : 1;
  }

  private parecerDecisao(valor?: string): number {
    const t = (valor ?? '').trim().toLowerCase();
    if (t.includes('indefer')) return 2;
    if (t.includes('defer')) return 1;
    if (t.includes('comuni')) return 3;
    const n = Number(t);
    return Number.isNaN(n) ? 0 : n;
  }

  /** Lê uma aba inteira como lista de objetos coluna(normalizada)->valor. */
  private lerLinhas(ws?: ExcelJS.Worksheet): Linha[] {
    if (!ws) return [];
    const header = ws.getRow(1);
    const cols = new Map<number, string>();
    header.eachCell((cell, n) => {
      const nome = this.valorCelula(cell).replace(/\*/g, '').trim().toLowerCase();
      if (nome) cols.set(n, nome);
    });
    const out: Linha[] = [];
    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const obj: Linha = {};
      let algum = false;
      cols.forEach((nome, n) => {
        const v = this.valorCelula(row.getCell(n));
        obj[nome] = v;
        if (v) algum = true;
      });
      if (algum) out.push(obj);
    }
    return out;
  }

  private agruparPorSei(linhas: Linha[]): Map<string, Linha[]> {
    const m = new Map<string, Linha[]>();
    for (const l of linhas) {
      const sei = this.semMascara(l['sei']);
      if (!sei) continue;
      if (!m.has(sei)) m.set(sei, []);
      m.get(sei)!.push(l);
    }
    return m;
  }

  private aba(wb: ExcelJS.Workbook, nome: string): ExcelJS.Worksheet | undefined {
    const alvo = nome.toLowerCase();
    return wb.worksheets.find((w) => w.name.trim().toLowerCase() === alvo);
  }

  // ------------------------------------------------------------------ execução

  async executar(buffer: Buffer): Promise<ImportarInicialResponseDTO> {
    if (!buffer || buffer.length === 0) {
      throw new ForbiddenException('Arquivo vazio ou não enviado.');
    }
    const wb = new ExcelJS.Workbook();
    try {
      await wb.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch {
      throw new ForbiddenException(
        'Não foi possível ler o arquivo. Envie um .xlsx válido.',
      );
    }

    const abaProcessos = this.aba(wb, 'Processos');
    if (!abaProcessos)
      throw new ForbiddenException('Planilha sem a aba "Processos".');

    // Caches de FKs por nome (case-insensitive).
    const norm = (s: string) => s.trim().toLowerCase();
    const [alvaras, unidades, subprefs, categorias, pareceres, usuarios] =
      await Promise.all([
        this.prisma.alvara_Tipo.findMany({ select: { id: true, nome: true } }),
        this.prisma.unidade.findMany({ select: { id: true, sigla: true } }),
        this.prisma.subprefeitura.findMany({
          select: { id: true, nome: true, sigla: true },
        }),
        this.prisma.categoria.findMany({ select: { id: true, categoria: true } }),
        this.prisma.parecer_Admissibilidade.findMany({
          select: { id: true, parecer: true },
        }),
        this.prisma.usuario.findMany({ select: { id: true, login: true } }),
      ]);
    const mapaAlvara = new Map(alvaras.map((a) => [norm(a.nome), a.id]));
    const mapaUnidade = new Map(unidades.map((u) => [norm(u.sigla), u.id]));
    const mapaSubpref = new Map<string, string>();
    for (const s of subprefs) {
      mapaSubpref.set(norm(s.sigla), s.id);
      mapaSubpref.set(norm(s.nome), s.id);
    }
    const mapaCategoria = new Map(
      categorias.map((c) => [norm(c.categoria), c.id]),
    );
    const mapaParecer = new Map(pareceres.map((p) => [norm(p.parecer), p.id]));
    const mapaUsuario = new Map(usuarios.map((u) => [norm(u.login), u.id]));

    // Abas-filhas agrupadas por SEI.
    const adm = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Admissibilidade')));
    const recon = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Reconsideracao')));
    const concl = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Conclusao')));
    const decisoes = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Decisoes')));
    const reunioes = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Reunioes')));
    const comuniques = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'ComuniqueSe')));
    const suspensoes = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Suspensoes')));
    const pedidos = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Pedidos')));
    const motivos = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'Motivos')));
    const sqls = this.agruparPorSei(this.lerLinhas(this.aba(wb, 'SQLs')));

    const processos = this.lerLinhas(abaProcessos);

    const detalhes: DetalheLinhaImportacaoDTO[] = [];
    let criados = 0;
    let duplicados = 0;
    let erros = 0;
    let total = 0;

    for (let i = 0; i < processos.length; i++) {
      const p = processos[i];
      const linhaExcel = i + 2;
      const sei = (p['sei'] ?? '').trim();
      const seiDigitos = this.semMascara(sei);
      total++;

      try {
        const requerimento = (p['requerimento'] ?? '').trim();
        const tipoAlvaraNome = (p['tipo_alvara'] ?? '').trim();
        const dataProtocolo = p['data_protocolo'];
        if (!sei || !requerimento || !tipoAlvaraNome || !dataProtocolo) {
          throw new Error(
            'Campos obrigatórios faltando (sei, requerimento, tipo_alvara, data_protocolo).',
          );
        }
        const alvara_tipo_id = mapaAlvara.get(norm(tipoAlvaraNome));
        if (!alvara_tipo_id)
          throw new Error(
            `Tipo de alvará "${tipoAlvaraNome}" não encontrado no sistema.`,
          );

        if ((await this.prisma.inicial.count({ where: { sei: seiDigitos } })) > 0) {
          duplicados++;
          detalhes.push({
            linha: linhaExcel,
            sei: seiDigitos,
            status: 'duplicado',
            mensagem: 'SEI já cadastrado.',
          });
          continue;
        }

        const filhos = await this.montarFilhos(p, seiDigitos, {
          adm,
          recon,
          concl,
          decisoes,
          reunioes,
          comuniques,
          suspensoes,
          pedidos,
          motivos,
          sqls,
          mapaUnidade,
          mapaSubpref,
          mapaCategoria,
          mapaParecer,
          mapaUsuario,
        });

        await this.prisma.$transaction(async (tx) => {
          const inicial = await tx.inicial.create({
            data: {
              sei: seiDigitos,
              requerimento,
              alvara_tipo_id,
              data_protocolo: this.data(dataProtocolo)!,
              envio_admissibilidade: this.data(p['envio_admissibilidade']),
              tipo_requerimento: this.int(p['tipo_requerimento']) ?? 1,
              tipo_processo: this.tipoProcesso(p['tipo_processo']),
              status: this.int(p['status']) ?? 1,
              etapa_analise: this.int(p['etapa_analise']) ?? 1,
              substatus_analise: this.int(p['substatus_analise']) ?? 0,
              pagamento: this.int(p['pagamento']) ?? 1,
              decreto: this.ehSim(p['decreto']),
              requalifica_rapido: this.ehSim(p['requalifica_rapido']),
              associado_reforma: this.ehSim(p['associado_reforma']),
              processo_fisico: this.semMascara(p['processo_fisico']) || null,
              aprova_digital: this.semMascara(p['aprova_digital']) || null,
              obs: p['obs']?.trim() || null,
            },
          });
          const id = inicial.id;

          await tx.admissibilidade.create({ data: { inicial_id: id, ...filhos.admissibilidade } });
          await tx.distribuicao.create({ data: { inicial_id: id, ...filhos.distribuicao } });
          if (filhos.interface)
            await tx.interface.create({ data: { inicial_id: id, ...filhos.interface } });
          if (filhos.reconsideracao)
            await tx.reconsideracao_Admissibilidade.create({
              data: { inicial_id: id, ...filhos.reconsideracao },
            });
          if (filhos.conclusao)
            await tx.conclusao.create({ data: { inicial_id: id, ...filhos.conclusao } });

          for (const d of filhos.decisoes)
            await tx.decisao.create({ data: { inicial_id: id, ...d } });
          for (const rn of filhos.reunioes)
            await tx.reuniao_Processo.create({ data: { inicial_id: id, ...rn } });
          for (const cs of filhos.comuniques)
            await tx.comunique_se.create({ data: { inicial_id: id, ...cs } });
          for (const sp of filhos.suspensoes)
            await tx.suspensao_Prazo.create({ data: { inicial_id: id, ...sp } });
          for (const sq of filhos.sqls)
            await tx.inicial_Sqls.create({ data: { inicial_id: id, sql: sq } });
          for (const pd of filhos.pedidos) {
            const pedido = await tx.pedido.upsert({
              where: { descricao: pd.descricao },
              create: { descricao: pd.descricao },
              update: {},
            });
            await tx.pedido_Inicial.create({
              data: {
                inicial_id: id,
                pedido_id: pedido.id,
                quantidade: pd.quantidade,
                medida: pd.medida,
              },
            });
          }
          for (const mv of filhos.motivos) {
            let motivo = await tx.motivo_Inadmissao.findFirst({
              where: { descricao: mv.descricao },
            });
            if (!motivo)
              motivo = await tx.motivo_Inadmissao.create({
                data: { descricao: mv.descricao },
              });
            await tx.motivo_Inadmissao_Inicial.create({
              data: {
                inicial_id: id,
                motivo_inadmissao_id: motivo.id,
                descricao: mv.detalhe,
              },
            });
          }
        });

        criados++;
        detalhes.push({
          linha: linhaExcel,
          sei: seiDigitos,
          status: 'criado',
          mensagem: filhos.resumo,
        });
      } catch (e) {
        erros++;
        detalhes.push({
          linha: linhaExcel,
          sei: seiDigitos || sei,
          status: 'erro',
          mensagem: e instanceof Error ? e.message : 'Erro ao importar linha.',
        });
      }
    }

    return { total, criados, duplicados, erros, detalhes };
  }

  // ----------------------------------------------------- montagem das filhas

  private async montarFilhos(
    p: Linha,
    sei: string,
    ctx: {
      adm: Map<string, Linha[]>;
      recon: Map<string, Linha[]>;
      concl: Map<string, Linha[]>;
      decisoes: Map<string, Linha[]>;
      reunioes: Map<string, Linha[]>;
      comuniques: Map<string, Linha[]>;
      suspensoes: Map<string, Linha[]>;
      pedidos: Map<string, Linha[]>;
      motivos: Map<string, Linha[]>;
      sqls: Map<string, Linha[]>;
      mapaUnidade: Map<string, string>;
      mapaSubpref: Map<string, string>;
      mapaCategoria: Map<string, string>;
      mapaParecer: Map<string, string>;
      mapaUsuario: Map<string, string>;
    },
  ) {
    const norm = (s: string) => s.trim().toLowerCase();
    const resolve = (mapa: Map<string, string>, valor?: string, rotulo?: string) => {
      const v = (valor ?? '').trim();
      if (!v) return undefined;
      const id = mapa.get(norm(v));
      if (!id) throw new Error(`${rotulo ?? 'Registro'} "${v}" não encontrado.`);
      return id;
    };

    // Admissibilidade (1:1) — usa dados da aba se houver, senão cria vazia.
    const a = ctx.adm.get(sei)?.[0];
    const admissibilidade: Omit<Prisma.AdmissibilidadeUncheckedCreateInput, 'inicial_id'> = {
      status: this.int(a?.['adm_status']) ?? 1,
      unidade_id: resolve(ctx.mapaUnidade, a?.['adm_unidade'], 'Unidade'),
      subprefeitura_id: resolve(ctx.mapaSubpref, a?.['adm_subprefeitura'], 'Subprefeitura'),
      categoria_id: resolve(ctx.mapaCategoria, a?.['adm_categoria'], 'Categoria'),
      parecer_admissibilidade_id: resolve(ctx.mapaParecer, a?.['adm_parecer'], 'Parecer de admissibilidade'),
      data_envio: this.data(a?.['adm_data_envio']) ?? this.data(p['envio_admissibilidade']),
      data_decisao_interlocutoria: this.data(a?.['adm_data_decisao_interlocutoria']),
      reconsiderado: this.ehSim(a?.['adm_reconsiderado']),
      obs: a?.['adm_obs']?.trim() || null,
    };

    // Distribuição (1:1) — vem de colunas dist_* da própria aba Processos.
    const distribuicao: Omit<Prisma.DistribuicaoUncheckedCreateInput, 'inicial_id'> = {
      tecnico_responsavel_id: resolve(ctx.mapaUsuario, p['dist_tecnico'], 'Técnico (login)'),
      administrativo_responsavel_id: resolve(ctx.mapaUsuario, p['dist_administrativo'], 'Administrativo (login)'),
      baixa_pagamento: this.int(p['dist_baixa_pagamento']) ?? 0,
      obs: p['dist_obs']?.trim() || null,
    };

    // Interface (1:1) — só GRAPROEM com algum dado.
    let iface: Omit<Prisma.InterfaceUncheckedCreateInput, 'inicial_id'> | null = null;
    if (this.tipoProcesso(p['tipo_processo']) === 2) {
      iface = {
        interface_sehab: this.ehSim(p['interface_sehab']),
        interface_siurb: this.ehSim(p['interface_siurb']),
        interface_smc: this.ehSim(p['interface_smc']),
        interface_smt: this.ehSim(p['interface_smt']),
        interface_svma: this.ehSim(p['interface_svma']),
        num_sehab: this.semMascara(p['num_sehab']) || null,
        num_siurb: this.semMascara(p['num_siurb']) || null,
        num_smc: this.semMascara(p['num_smc']) || null,
        num_smt: this.semMascara(p['num_smt']) || null,
        num_svma: this.semMascara(p['num_svma']) || null,
      };
    }

    // Reconsideração (1:1).
    const rc = ctx.recon.get(sei)?.[0];
    const reconsideracao = rc
      ? {
          pedido_reconsideracao: this.data(rc['pedido_reconsideracao']),
          envio: this.data(rc['envio']),
          publicacao: this.data(rc['publicacao']),
          parecer: this.ehSim(rc['parecer']),
        }
      : null;

    // Conclusão (1:1).
    const cc = ctx.concl.get(sei)?.[0];
    let conclusao: Omit<Prisma.ConclusaoUncheckedCreateInput, 'inicial_id'> | null = null;
    if (cc) {
      const num_alvara = (cc['num_alvara'] ?? '').trim();
      if (!num_alvara)
        throw new Error('Conclusão: "num_alvara" é obrigatório.');
      conclusao = {
        num_alvara,
        obs: cc['obs']?.trim() ?? '',
        outorga: this.ehSim(cc['outorga']),
        data_conclusao: this.data(cc['data_conclusao']),
        data_emissao: this.data(cc['data_emissao']),
        data_outorga: this.data(cc['data_outorga']),
        data_apostilamento: this.data(cc['data_apostilamento']),
        data_termo: this.data(cc['data_termo']),
        data_resposta: this.data(cc['data_resposta']),
      };
    }

    // Decisões (N).
    const decisoes = (ctx.decisoes.get(sei) ?? []).map((d) => ({
      instancia: this.int(d['instancia']) ?? 1,
      parecer: this.parecerDecisao(d['parecer']),
      publicacao_parecer: this.data(d['data_publicacao']),
      parecer_tecnico: d['parecer_tecnico']?.trim() || null,
      obs: d['obs']?.trim() || null,
      motivo: d['motivo']?.trim() || null,
      analise_smul: this.data(d['analise_smul']),
      analise_smc: this.data(d['analise_smc']),
      analise_sehab: this.data(d['analise_sehab']),
      analise_siurb: this.data(d['analise_siurb']),
      analise_svma: this.data(d['analise_svma']),
    }));

    // Reuniões (N).
    const reunioes = (ctx.reunioes.get(sei) ?? []).map((r) => {
      const data_reuniao = this.data(r['data_reuniao']);
      const data_processo = this.data(r['data_processo']);
      if (!data_reuniao || !data_processo)
        throw new Error('Reunião: "data_reuniao" e "data_processo" são obrigatórias.');
      return {
        instancia: this.int(r['instancia']) ?? 1,
        data_reuniao,
        data_processo,
        nova_data_reuniao: this.data(r['nova_data_reuniao']),
        justificativa_remarcacao: r['justificativa_remarcacao']?.trim() || null,
        numero_reuniao: r['numero_reuniao']?.trim() || null,
        parecer_grupo: r['parecer_grupo']?.trim() || null,
      };
    });

    // Comunique-se (N).
    const comuniques = (ctx.comuniques.get(sei) ?? []).map((c) => {
      const data = this.data(c['data']);
      const etapa = this.int(c['etapa']);
      if (!data || etapa == null)
        throw new Error('Comunique-se: "data" e "etapa" são obrigatórios.');
      return {
        data,
        etapa,
        complementar: this.ehSim(c['complementar']),
        data_resposta: this.data(c['data_resposta']),
      };
    });

    // Suspensões (N).
    const suspensoes = (ctx.suspensoes.get(sei) ?? []).map((s) => {
      const inicio = this.data(s['inicio']);
      const motivo = this.int(s['motivo']);
      const etapa = this.int(s['etapa']);
      if (!inicio || motivo == null || etapa == null)
        throw new Error('Suspensão: "inicio", "motivo" e "etapa" são obrigatórios.');
      return { inicio, final: this.data(s['final']), motivo, etapa };
    });

    // Pedidos (N).
    const pedidos = (ctx.pedidos.get(sei) ?? []).map((pd) => {
      const descricao = (pd['pedido'] ?? '').trim();
      const quantidade = this.int(pd['quantidade']);
      const medida = (pd['medida'] ?? '').trim();
      if (!descricao || quantidade == null || !medida)
        throw new Error('Pedido: "pedido", "quantidade" e "medida" são obrigatórios.');
      return { descricao, quantidade, medida };
    });

    // Motivos de inadmissão (N).
    const motivos = (ctx.motivos.get(sei) ?? []).map((mv) => {
      const descricao = (mv['motivo'] ?? '').trim();
      if (!descricao) throw new Error('Motivo de inadmissão: "motivo" é obrigatório.');
      return { descricao, detalhe: mv['descricao']?.trim() || null };
    });

    // SQLs (N).
    const sqls = (ctx.sqls.get(sei) ?? [])
      .map((sq) => (sq['sql'] ?? '').trim())
      .filter(Boolean);

    const resumo =
      `${decisoes.length} decisão(ões), ${reunioes.length} reunião(ões), ` +
      `${comuniques.length} comunique-se, ${suspensoes.length} suspensão(ões), ` +
      `${pedidos.length} pedido(s), ${motivos.length} motivo(s), ${sqls.length} SQL(s).`;

    return {
      admissibilidade,
      distribuicao,
      interface: iface,
      reconsideracao,
      conclusao,
      decisoes,
      reunioes,
      comuniques,
      suspensoes,
      pedidos,
      motivos,
      sqls,
      resumo,
    };
  }
}
