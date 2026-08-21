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
 * Importa processos com histórico completo a partir da planilha .xlsx revisada
 * pelos usuários. Não-destrutivo (adiciona; SEIs já existentes = duplicados),
 * cada processo numa transação própria.
 *
 * Estrutura da planilha:
 * - Cabeçalho técnico na linha cuja coluna 1 é `sei`/`processo` (linha 1 pode
 *   ser um rótulo amigável); dados começam na linha seguinte.
 * - Abas-filhas ligadas pelo SEI (coluna `sei` ou `processo`).
 * - Decisoes/Reunioes: blocos de instância lado a lado (uma linha por processo).
 * - SQLs: um SQL por coluna (uma linha por processo).
 */
export class ImportadorPlanilha {
  constructor(private prisma: PrismaService) {}

  // ------------------------------------------------------------- primitivos

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

  private norm(s: string): string {
    return (s ?? '').trim().toLowerCase();
  }

  private chaveHeader(cell: ExcelJS.Cell | undefined): string {
    return this.norm(this.valorCelula(cell).replace(/\*/g, ''));
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

  /** Aceita número (1/0) ou SIM/NAO -> 1/0. undefined se vazio. */
  private intOuSim(valor?: string): number | undefined {
    const texto = (valor ?? '').trim();
    if (texto === '') return undefined;
    const n = Number(texto);
    if (!Number.isNaN(n)) return n;
    return this.ehSim(texto) ? 1 : 0;
  }

  private semMascara(valor?: string): string {
    return (valor ?? '').replace(/\D/g, '');
  }

  private tipoProcesso(valor?: string): number {
    const t = this.norm(valor ?? '');
    if (t.includes('grapro')) return 2;
    if (t.includes('smul') || t.includes('próprio') || t.includes('proprio'))
      return 1;
    return Number(t) === 2 ? 2 : 1;
  }

  private parecerDecisao(valor?: string): number {
    const t = this.norm(valor ?? '');
    if (t.includes('indefer')) return 2;
    if (t.includes('defer')) return 1;
    if (t.includes('comuni')) return 3;
    const n = Number(t);
    return Number.isNaN(n) ? 0 : n;
  }

  // -------------------------------------------------------- leitura de abas

  private aba(wb: ExcelJS.Workbook, nome: string): ExcelJS.Worksheet | undefined {
    const alvo = nome.toLowerCase();
    return wb.worksheets.find((w) => w.name.trim().toLowerCase() === alvo);
  }

  /** Linha do cabeçalho técnico = primeira (1..4) cuja col.1 é sei/processo. */
  private linhaHeader(ws: ExcelJS.Worksheet): number {
    const max = Math.min(ws.rowCount || 1, 4);
    for (let r = 1; r <= max; r++) {
      const k = this.chaveHeader(ws.getRow(r).getCell(1));
      if (k === 'sei' || k === 'processo') return r;
    }
    return 1;
  }

  private headers(ws: ExcelJS.Worksheet, hr: number): { col: number; key: string }[] {
    const out: { col: number; key: string }[] = [];
    ws.getRow(hr).eachCell((cell, col) => {
      const k = this.chaveHeader(cell);
      if (k) out.push({ col, key: k });
    });
    return out;
  }

  private seiDeLinha(l: Linha): string {
    return this.semMascara(l['sei'] || l['processo']);
  }

  /** Lê aba "tall": uma linha = um registro; agrupa por SEI. */
  private lerAgrupado(ws?: ExcelJS.Worksheet): Map<string, Linha[]> {
    const map = new Map<string, Linha[]>();
    if (!ws) return map;
    const hr = this.linhaHeader(ws);
    const hs = this.headers(ws, hr);
    const colPorKey = new Map<string, number>();
    for (const h of hs) if (!colPorKey.has(h.key)) colPorKey.set(h.key, h.col);
    for (let r = hr + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const obj: Linha = {};
      let algum = false;
      colPorKey.forEach((col, key) => {
        const v = this.valorCelula(row.getCell(col));
        obj[key] = v;
        if (v) algum = true;
      });
      if (!algum) continue;
      const sei = this.seiDeLinha(obj);
      if (!sei) continue;
      if (!map.has(sei)) map.set(sei, []);
      map.get(sei)!.push(obj);
    }
    return map;
  }

  /** Lê aba com blocos de instância lado a lado; agrupa por SEI. */
  private lerBlocos(ws?: ExcelJS.Worksheet): Map<string, Linha[]> {
    const map = new Map<string, Linha[]>();
    if (!ws) return map;
    const hr = this.linhaHeader(ws);
    const hs = this.headers(ws, hr);
    const colSei =
      hs.find((h) => h.key === 'sei' || h.key === 'processo')?.col ?? 1;
    const inicios = hs
      .filter((h) => h.key === 'instancia')
      .map((h) => h.col)
      .sort((a, b) => a - b);
    if (inicios.length === 0) return map;
    for (let r = hr + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const sei = this.semMascara(this.valorCelula(row.getCell(colSei)));
      if (!sei) continue;
      for (let b = 0; b < inicios.length; b++) {
        const start = inicios[b];
        const end = b + 1 < inicios.length ? inicios[b + 1] : Number.MAX_SAFE_INTEGER;
        const obj: Linha = {};
        let algum = false;
        for (const h of hs) {
          if (h.col >= start && h.col < end) {
            const v = this.valorCelula(row.getCell(h.col));
            obj[h.key] = v;
            if (v) algum = true;
          }
        }
        if (!algum) continue;
        if (!obj['instancia']) obj['instancia'] = String(b + 1);
        if (!map.has(sei)) map.set(sei, []);
        map.get(sei)!.push(obj);
      }
    }
    return map;
  }

  /** Lê a aba SQLs no formato "um SQL por coluna"; agrupa por SEI. */
  private lerSqls(ws?: ExcelJS.Worksheet): Map<string, string[]> {
    const map = new Map<string, string[]>();
    if (!ws) return map;
    const hr = this.linhaHeader(ws);
    const hs = this.headers(ws, hr);
    const colSei =
      hs.find((h) => h.key === 'sei' || h.key === 'processo')?.col ?? 1;
    for (let r = hr + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const sei = this.semMascara(this.valorCelula(row.getCell(colSei)));
      if (!sei) continue;
      const lista = map.get(sei) ?? [];
      for (const h of hs) {
        if (h.col === colSei) continue;
        const v = this.valorCelula(row.getCell(h.col)).trim();
        if (v) lista.push(v);
      }
      if (lista.length) map.set(sei, lista);
    }
    return map;
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

    // Caches de FKs por nome.
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
        this.prisma.usuario.findMany({ select: { id: true, login: true, nome: true } }),
      ]);
    const mapaAlvara = new Map(alvaras.map((a) => [this.norm(a.nome), a.id]));
    const mapaUnidade = new Map(unidades.map((u) => [this.norm(u.sigla), u.id]));
    const mapaSubpref = new Map<string, string>();
    for (const s of subprefs) {
      mapaSubpref.set(this.norm(s.sigla), s.id);
      mapaSubpref.set(this.norm(s.nome), s.id);
    }
    const mapaCategoria = new Map(
      categorias.map((c) => [this.norm(c.categoria), c.id]),
    );
    const mapaParecer = new Map(pareceres.map((p) => [this.norm(p.parecer), p.id]));
    const mapaUsuario = new Map<string, string>();
    for (const u of usuarios) {
      mapaUsuario.set(this.norm(u.login), u.id);
      if (u.nome) mapaUsuario.set(this.norm(u.nome), u.id);
    }

    // Abas-filhas.
    const adm = this.lerAgrupado(this.aba(wb, 'Admissibilidade'));
    const recon = this.lerAgrupado(this.aba(wb, 'Reconsideracao'));
    const concl = this.lerAgrupado(this.aba(wb, 'Conclusao'));
    const comuniques = this.lerAgrupado(this.aba(wb, 'ComuniqueSe'));
    const suspensoes = this.lerAgrupado(this.aba(wb, 'Suspensoes'));
    const pedidos = this.lerAgrupado(this.aba(wb, 'Pedidos'));
    const motivos = this.lerAgrupado(this.aba(wb, 'Motivos'));
    const decisoes = this.lerBlocos(this.aba(wb, 'Decisoes'));
    const reunioes = this.lerBlocos(this.aba(wb, 'Reunioes'));
    const sqls = this.lerSqls(this.aba(wb, 'SQLs'));

    const processos = this.lerAgrupadoPlano(abaProcessos);

    const detalhes: DetalheLinhaImportacaoDTO[] = [];
    let criados = 0;
    let duplicados = 0;
    let erros = 0;
    let total = 0;

    for (const { linhaExcel, dados: p } of processos) {
      total++;
      // processo (col principal) e processo_sei (SEI secundário).
      const principal = (p['processo'] || p['sei'] || '').trim();
      const secundario = (p['processo_sei'] || '').trim();
      const secundarioValido = this.semMascara(secundario).length >= 8;
      const sei = secundarioValido
        ? this.semMascara(secundario)
        : this.semMascara(principal);
      const processoFisico = secundarioValido ? principal : null;

      try {
        const requerimento = (p['requerimento'] || '').trim();
        const tipoAlvaraNome = (p['tipo_alvara'] || '').trim();
        const dataProtocolo = p['data_protocolo'];
        const faltando: string[] = [];
        if (!sei) faltando.push('processo');
        if (!requerimento) faltando.push('requerimento');
        if (!tipoAlvaraNome) faltando.push('tipo_alvara');
        if (!dataProtocolo) faltando.push('data_protocolo');
        if (faltando.length) {
          throw new Error(`Campos obrigatórios faltando: ${faltando.join(', ')}.`);
        }
        const alvara_tipo_id = mapaAlvara.get(this.norm(tipoAlvaraNome));
        if (!alvara_tipo_id)
          throw new Error(
            `Tipo de alvará "${tipoAlvaraNome}" não encontrado no sistema.`,
          );

        if ((await this.prisma.inicial.count({ where: { sei } })) > 0) {
          duplicados++;
          detalhes.push({
            linha: linhaExcel,
            sei,
            status: 'duplicado',
            mensagem: 'Processo já cadastrado.',
          });
          continue;
        }

        const filhos = this.montarFilhos(p, sei, processoFisico, alvara_tipo_id, {
          adm, recon, concl, decisoes, reunioes, comuniques, suspensoes,
          pedidos, motivos, sqls,
          mapaUnidade, mapaSubpref, mapaCategoria, mapaParecer, mapaUsuario,
        });

        await this.prisma.$transaction(async (tx) => {
          const inicial = await tx.inicial.create({ data: filhos.inicial });
          const id = inicial.id;

          await tx.admissibilidade.create({ data: { inicial_id: id, ...filhos.admissibilidade } });
          await tx.distribuicao.create({ data: { inicial_id: id, ...filhos.distribuicao } });
          if (filhos.interface)
            await tx.interface.create({ data: { inicial_id: id, ...filhos.interface } });
          if (filhos.reconsideracao)
            await tx.reconsideracao_Admissibilidade.create({ data: { inicial_id: id, ...filhos.reconsideracao } });
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
              data: { inicial_id: id, pedido_id: pedido.id, quantidade: pd.quantidade, medida: pd.medida },
            });
          }
          for (const mv of filhos.motivos) {
            let motivo = await tx.motivo_Inadmissao.findFirst({ where: { descricao: mv.descricao } });
            if (!motivo)
              motivo = await tx.motivo_Inadmissao.create({ data: { descricao: mv.descricao } });
            await tx.motivo_Inadmissao_Inicial.create({
              data: { inicial_id: id, motivo_inadmissao_id: motivo.id, descricao: mv.detalhe },
            });
          }
        });

        criados++;
        detalhes.push({ linha: linhaExcel, sei, status: 'criado', mensagem: filhos.resumo });
      } catch (e) {
        erros++;
        detalhes.push({
          linha: linhaExcel,
          sei: sei || principal,
          status: 'erro',
          mensagem: e instanceof Error ? e.message : 'Erro ao importar linha.',
        });
      }
    }

    return { total, criados, duplicados, erros, detalhes };
  }

  /** Aba Processos: uma linha = um processo (com nº da linha no Excel). */
  private lerAgrupadoPlano(ws: ExcelJS.Worksheet): { linhaExcel: number; dados: Linha }[] {
    const hr = this.linhaHeader(ws);
    const hs = this.headers(ws, hr);
    const colPorKey = new Map<string, number>();
    for (const h of hs) if (!colPorKey.has(h.key)) colPorKey.set(h.key, h.col);
    const out: { linhaExcel: number; dados: Linha }[] = [];
    for (let r = hr + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const obj: Linha = {};
      let algum = false;
      colPorKey.forEach((col, key) => {
        const v = this.valorCelula(row.getCell(col));
        obj[key] = v;
        if (v) algum = true;
      });
      if (algum) out.push({ linhaExcel: r, dados: obj });
    }
    return out;
  }

  // ----------------------------------------------------- montagem das filhas

  private montarFilhos(
    p: Linha,
    sei: string,
    processoFisico: string | null,
    alvara_tipo_id: string,
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
      sqls: Map<string, string[]>;
      mapaUnidade: Map<string, string>;
      mapaSubpref: Map<string, string>;
      mapaCategoria: Map<string, string>;
      mapaParecer: Map<string, string>;
      mapaUsuario: Map<string, string>;
    },
  ) {
    // FK opcional: vazio -> null; preenchido mas não encontrado -> erro (dado
    // a corrigir). Usado em unidade/subprefeitura/categoria/parecer.
    const resolveObrig = (mapa: Map<string, string>, valor?: string, rotulo?: string) => {
      const v = (valor ?? '').trim();
      if (!v) return undefined;
      const id = mapa.get(this.norm(v));
      if (!id) throw new Error(`${rotulo ?? 'Registro'} "${v}" não encontrado.`);
      return id;
    };
    // Responsáveis: best-effort (nomes soltos) — null se não encontrar.
    const resolveUsuario = (valor?: string) => {
      const v = (valor ?? '').trim();
      if (!v) return undefined;
      return ctx.mapaUsuario.get(this.norm(v));
    };

    // ---- Inicial (com campos novos) ----
    const inicial: Prisma.InicialUncheckedCreateInput = {
      sei,
      requerimento: (p['requerimento'] || '').trim(),
      alvara_tipo_id,
      data_protocolo: this.data(p['data_protocolo'])!,
      envio_admissibilidade: this.data(p['envio_admissibilidade']),
      tipo_requerimento: this.int(p['tipo_requerimento']) ?? 1,
      tipo_processo: this.tipoProcesso(p['tipo_processo']),
      status: this.int(p['status']) ?? 1,
      etapa_analise: this.int(p['etapa_analise']) ?? 1,
      substatus_analise: this.int(p['substatus_analise']) ?? 0,
      pagamento: this.intOuSim(p['pagamento']) ?? 1,
      decreto: this.ehSim(p['decreto']),
      requalifica_rapido: this.ehSim(p['requalifica_rapido']),
      associado_reforma: this.ehSim(p['associado_reforma']),
      processo_fisico: processoFisico ? this.semMascara(processoFisico) || processoFisico : null,
      aprova_digital: this.semMascara(p['aprova_digital']) || null,
      obs: p['obs']?.trim() || null,
      numero_requerimento: p['numero_requerimento']?.trim() || null,
      ar_ou_rr: p['arourr']?.trim() || null,
      numero_guia_tev: this.semMascara(p['numero_guia_tev']) || null,
      guia_vinculada_outro: this.ehSim(p['vinculado_outro']),
    };

    // ---- Admissibilidade (1:1) ----
    const a = ctx.adm.get(sei)?.[0];
    const admissibilidade: Omit<Prisma.AdmissibilidadeUncheckedCreateInput, 'inicial_id'> = {
      status: this.int(a?.['adm_status']) ?? 1,
      unidade_id: resolveObrig(ctx.mapaUnidade, a?.['adm_unidade'], 'Unidade'),
      subprefeitura_id: resolveObrig(ctx.mapaSubpref, a?.['adm_subprefeitura'], 'Subprefeitura'),
      categoria_id: resolveObrig(ctx.mapaCategoria, a?.['adm_categoria'], 'Categoria'),
      parecer_admissibilidade_id: resolveObrig(ctx.mapaParecer, a?.['adm_parecer'], 'Parecer de admissibilidade'),
      data_envio: this.data(a?.['adm_data_envio']) ?? this.data(p['envio_admissibilidade']),
      data_decisao_interlocutoria: this.data(a?.['adm_data_decisao_interlocutoria']),
      reconsiderado: this.ehSim(a?.['adm_reconsiderado']),
      obs: a?.['adm_obs']?.trim() || null,
    };

    // ---- Distribuição (1:1) ----
    const distribuicao: Omit<Prisma.DistribuicaoUncheckedCreateInput, 'inicial_id'> = {
      tecnico_responsavel_id: resolveUsuario(p['dist_tecnico']),
      administrativo_responsavel_id: resolveUsuario(p['dist_administrativo']),
      baixa_pagamento: this.intOuSim(p['dist_baixa_pagamento']) ?? 0,
      obs: p['dist_obs']?.trim() || null,
    };

    // ---- Interface (GRAPROEM) ----
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

    // ---- Reconsideração (1:1) ----
    const rc = ctx.recon.get(sei)?.[0];
    const reconsideracao = rc
      ? {
          pedido_reconsideracao: this.data(rc['pedido_reconsideracao']),
          envio: this.data(rc['envio']),
          publicacao: this.data(rc['publicacao']),
          parecer: this.ehSim(rc['parecer']),
        }
      : null;

    // ---- Conclusão (1:1) ----
    const cc = ctx.concl.get(sei)?.[0];
    let conclusao: Omit<Prisma.ConclusaoUncheckedCreateInput, 'inicial_id'> | null = null;
    if (cc) {
      const num_alvara = (cc['num_alvara'] ?? '').trim();
      if (!num_alvara) throw new Error('Conclusão: "num_alvara" é obrigatório.');
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

    // Mantém só a 1ª ocorrência de cada instância (evita violar o unique).
    const dedupInst = <T extends { instancia: number }>(arr: T[]): T[] => {
      const vistos = new Set<number>();
      return arr.filter((x) => (vistos.has(x.instancia) ? false : (vistos.add(x.instancia), true)));
    };

    // ---- Decisões (N blocos) ----
    const decisoes = dedupInst((ctx.decisoes.get(sei) ?? [])
      .filter((d) =>
        (d['parecer'] ?? '').trim() ||
        (d['data_publicacao'] ?? '').trim() ||
        (d['parecer_tecnico'] ?? '').trim(),
      )
      .map((d) => ({
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
      })));

    // ---- Reuniões (N blocos) ----
    const reunioes = dedupInst((ctx.reunioes.get(sei) ?? [])
      .filter((r) =>
        (r['data_reuniao'] ?? '').trim() ||
        (r['numero_reuniao'] ?? '').trim() ||
        (r['parecer_grupo'] ?? '').trim(),
      )
      .map((r) => {
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
          data_publicacao: this.data(r['data_publicacao']),
        };
      }));

    // ---- Comunique-se (N) ----
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

    // ---- Suspensões (N) ----
    const suspensoes = (ctx.suspensoes.get(sei) ?? []).map((s) => {
      const inicio = this.data(s['inicio']);
      const motivo = this.int(s['motivo']);
      const etapa = this.int(s['etapa']);
      if (!inicio || motivo == null || etapa == null)
        throw new Error('Suspensão: "inicio", "motivo" e "etapa" são obrigatórios.');
      return { inicio, final: this.data(s['final']), motivo, etapa };
    });

    // ---- Pedidos (N) ----
    const pedidos = (ctx.pedidos.get(sei) ?? []).map((pd) => {
      const descricao = (pd['pedido'] ?? '').trim();
      const quantidade = this.int(pd['quantidade']);
      const medida = (pd['medida'] ?? '').trim();
      if (!descricao || quantidade == null || !medida)
        throw new Error('Pedido: "pedido", "quantidade" e "medida" são obrigatórios.');
      return { descricao, quantidade, medida };
    });

    // ---- Motivos de inadmissão (N) ----
    const motivos = (ctx.motivos.get(sei) ?? []).map((mv) => {
      const descricao = (mv['motivo'] ?? '').trim();
      if (!descricao) throw new Error('Motivo de inadmissão: "motivo" é obrigatório.');
      return { descricao, detalhe: mv['descricao']?.trim() || null };
    });

    // ---- SQLs (por coluna) ----
    const sqls = ctx.sqls.get(sei) ?? [];

    const resumo =
      `${decisoes.length} decisão(ões), ${reunioes.length} reunião(ões), ` +
      `${comuniques.length} comunique-se, ${suspensoes.length} suspensão(ões), ` +
      `${pedidos.length} pedido(s), ${motivos.length} motivo(s), ${sqls.length} SQL(s).`;

    return {
      inicial,
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
