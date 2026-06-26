import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { RelatorioService } from '../relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from '../relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from '../ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from '../relatorio-complementar/relatorio-complementar.service';

type FormatoExportacao = 'excel' | 'pdf';

interface ExportarRelatorioParams {
  dataInicial?: string;
  dataFinal?: string;
  anoInicial?: string;
  anoFinal?: string;
  periodo?: string;
}

interface LinhaExportacao {
  [key: string]: string | number | boolean | null;
}

interface AbaExportacao {
  nome: string;
  linhas: LinhaExportacao[];
}

interface RelatorioExportacao {
  titulo: string;
  periodo?: string;
  abas: AbaExportacao[];
}

@Injectable()
export class RelatorioExportacaoService {
  constructor(
    private readonly relatorioService: RelatorioService,
    private readonly relatorioRRService: RelatorioRRService,
    private readonly arGraficoProgressaoMensal: ArGraficoProgressaoMensalService,
    private readonly relatorioComplementarService: RelatorioComplementarService,
  ) {}

  async exportar(
    tipoRelatorio: string,
    formato: string,
    params: ExportarRelatorioParams,
  ): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
    const formatoNormalizado = this.normalizarFormato(formato);
    const relatorio = await this.montarRelatorio(tipoRelatorio, params);
    const extensao = formatoNormalizado === 'excel' ? 'xlsx' : 'pdf';
    const filename = `${this.slug(tipoRelatorio)}-${this.dataArquivo()}.${extensao}`;

    if (formatoNormalizado === 'excel') {
      return {
        buffer: await this.gerarExcel(relatorio),
        filename,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    }

    return {
      buffer: await this.gerarPdf(relatorio),
      filename,
      contentType: 'application/pdf',
    };
  }

  private async montarRelatorio(
    tipoRelatorio: string,
    params: ExportarRelatorioParams,
  ): Promise<RelatorioExportacao> {
    switch (tipoRelatorio) {
      case 'ar-quantitativo': {
        const { mes, ano } = this.extrairMesAno(params.dataFinal ?? params.dataInicial ?? params.periodo);
        const dados = await this.relatorioService.getRelatorio(mes, ano);
        return this.montarQuantitativo(
          'Aprova Rapido - Status e Resumo Quantitativo',
          dados,
          `${mes}/${ano}`,
        );
      }
      case 'rr-quantitativo': {
        const { mes, ano } = this.extrairMesAno(params.dataInicial ?? params.dataFinal ?? params.periodo);
        const dados = await this.relatorioRRService.getRelatorio(mes, ano);
        return this.montarQuantitativo(
          'Requalifica Rapido - Status e Resumo Quantitativo',
          dados,
          `${mes}/${ano}`,
        );
      }
      case 'ar-progressao-mensal': {
        const anoInicial = Number(params.anoInicial);
        const anoFinal = Number(params.anoFinal);
        const dados = await this.arGraficoProgressaoMensal.getByYearRange(anoInicial, anoFinal);
        return {
          titulo: 'Aprova Rapido - Grafico de Progressao Mensal',
          periodo: `${anoInicial} a ${anoFinal}`,
          abas: [
            {
              nome: 'Progressao Mensal',
              linhas: dados.flatMap((item) =>
                item.mes.map((mensal, index) => ({
                  ano: item.ano,
                  mes: this.nomeMes(index),
                  'Protocolados no mes': mensal,
                  'Protocolados acumulados': item.acc[index],
                })),
              ),
            },
          ],
        };
      }
      case 'ar-gabinete-prefeito': {
        const dados = await this.relatorioComplementarService.getGabinetePrefeito();
        return this.montarGabinetePrefeito(dados);
      }
      case 'ar-analise-admissibilidade': {
        const { dataInicial, dataFinal } = this.extrairPeriodo(params);
        const dados = await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeAR(dataInicial, dataFinal);
        return this.montarPrazoAnalise(
          'Aprova Rapido - Analise de Admissibilidade',
          dados,
        );
      }
      case 'rr-analise-admissibilidade': {
        const { dataInicial, dataFinal } = this.extrairPeriodo(params);
        const dados = await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeRR(dataInicial, dataFinal);
        return this.montarPrazoAnalise(
          'Requalifica Rapido - Analise de Admissibilidade',
          dados,
        );
      }
      default:
        throw new BadRequestException('Tipo de relatorio invalido.');
    }
  }

  private async gerarExcel(relatorio: RelatorioExportacao): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SISAR';
    workbook.created = new Date();
    const nomesAbas = new Set<string>();

    for (const aba of relatorio.abas) {
      const worksheet = workbook.addWorksheet(this.nomeAbaUnico(aba.nome, nomesAbas));
      worksheet.addRow([relatorio.titulo]);
      worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' },
      };
      worksheet.getRow(1).alignment = { horizontal: 'center' };
      worksheet.addRow([aba.nome]);
      worksheet.getRow(2).font = { bold: true, size: 11 };
      if (relatorio.periodo) {
        worksheet.addRow([`Periodo: ${relatorio.periodo}`]);
        worksheet.getRow(3).font = { italic: true };
      }
      worksheet.addRow([]);

      const colunas = this.colunas(aba.linhas);
      if (colunas.length === 0) {
        worksheet.addRow(['Sem dados']);
        continue;
      }

      const headerIndex = relatorio.periodo ? 5 : 4;
      worksheet.addRow(colunas);
      const header = worksheet.getRow(headerIndex);
      header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      header.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      header.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

      for (const linha of aba.linhas) {
        worksheet.addRow(colunas.map((coluna) => linha[coluna] ?? ''));
      }

      if (colunas.length > 1) {
        worksheet.mergeCells(1, 1, 1, colunas.length);
        worksheet.mergeCells(2, 1, 2, colunas.length);
        if (relatorio.periodo) worksheet.mergeCells(3, 1, 3, colunas.length);
      }

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            left: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            bottom: { style: 'thin', color: { argb: 'FFD9E2F3' } },
            right: { style: 'thin', color: { argb: 'FFD9E2F3' } },
          };
          cell.alignment = {
            vertical: 'top',
            wrapText: rowNumber > headerIndex,
          };
        });
      });

      worksheet.views = [{ state: 'frozen', ySplit: headerIndex }];
      worksheet.autoFilter = {
        from: { row: headerIndex, column: 1 },
        to: { row: headerIndex, column: colunas.length },
      };

      worksheet.columns = colunas.map((coluna) => ({
        key: coluna,
        width: this.larguraColuna(coluna, aba.linhas),
      }));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async gerarPdf(relatorio: RelatorioExportacao): Promise<Buffer> {
    const pdfmake = require('pdfmake');
    const fonteBase = path.join(
      path.dirname(require.resolve('pdfmake/package.json')),
      'fonts',
      'Roboto',
    );

    pdfmake.setFonts({
      Roboto: {
        normal: path.join(fonteBase, 'Roboto-Regular.ttf'),
        bold: path.join(fonteBase, 'Roboto-Medium.ttf'),
        italics: path.join(fonteBase, 'Roboto-Italic.ttf'),
        bolditalics: path.join(fonteBase, 'Roboto-MediumItalic.ttf'),
      },
    });
    pdfmake.setLocalAccessPolicy((filePath: string) => filePath.startsWith(fonteBase));
    pdfmake.setUrlAccessPolicy(() => false);

    const content: any[] = [
      { text: relatorio.titulo, style: 'titulo', margin: [0, 0, 0, 12] },
    ];
    if (relatorio.periodo) {
      content.push({ text: `Periodo: ${relatorio.periodo}`, style: 'periodo', margin: [0, 0, 0, 10] });
    }

    for (const aba of relatorio.abas) {
      const colunas = this.colunas(aba.linhas);
      content.push({ text: aba.nome, style: 'subtitulo', margin: [0, 8, 0, 6] });

      if (colunas.length === 0) {
        content.push({ text: 'Sem dados', margin: [0, 0, 0, 8] });
        continue;
      }

      for (const bloco of this.dividirColunasPdf(colunas)) {
        content.push({
          table: {
            headerRows: 1,
            widths: bloco.map(() => '*'),
            body: [
              bloco.map((coluna) => ({ text: coluna, style: 'cabecalhoTabela' })),
              ...aba.linhas.map((linha) =>
                bloco.map((coluna) => String(linha[coluna] ?? '')),
              ),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        });
      }
    }

    const pdf = pdfmake.createPdf({
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 7,
      },
      styles: {
        titulo: { fontSize: 14, bold: true },
        periodo: { fontSize: 9, italics: true },
        subtitulo: { fontSize: 10, bold: true },
        cabecalhoTabela: { bold: true, fillColor: '#D9E2F3' },
      },
      content,
    });

    return await pdf.getBuffer();
  }

  private normalizarRelatorio(titulo: string, dados: unknown): RelatorioExportacao {
    return {
      titulo,
      abas: this.extrairAbas('Resumo', dados),
    };
  }

  private montarQuantitativo(titulo: string, dados: any, periodo: string): RelatorioExportacao {
    const abas: AbaExportacao[] = [
      {
        nome: 'Resumo',
        linhas: [
          { Indicador: 'Total de processos', Quantidade: dados.total ?? 0 },
          { Indicador: 'Analise de admissibilidade', Quantidade: dados.analise ?? 0 },
          { Indicador: 'Inadmissiveis', Quantidade: dados.inadmissiveis ?? 0 },
          { Indicador: 'Admissiveis', Quantidade: dados.admissiveis ?? 0 },
          { Indicador: 'Data de geracao', Quantidade: dados.data_gerado ?? '' },
        ],
      },
      ...this.montarAbasStatusQuantitativo(dados),
    ];

    return { titulo, periodo, abas };
  }

  private montarAbasStatusQuantitativo(dados: any): AbaExportacao[] {
    const secoes = [
      ['Em analise', dados.em_analise],
      ['Deferidos', dados.deferidos],
      ['Indeferidos', dados.indeferidos],
    ] as const;

    return secoes.map(([nome, secao]) => ({
      nome,
      linhas: this.linhasStatus(secao),
    }));
  }

  private linhasStatus(secao: any): LinhaExportacao[] {
    if (!secao) return [];

    return Object.entries(secao).map(([orgao, detalhe]: [string, any]) => ({
      Orgao: orgao.toUpperCase(),
      Quantidade: detalhe?.quantidade ?? 0,
      Detalhamento: this.descreverDetalhamento(detalhe?.data),
    }));
  }

  private montarPrazoAnalise(titulo: string, dados: any): RelatorioExportacao {
    const linhas = Array.isArray(dados.dados)
      ? dados.dados
      : this.flattenDadosPorAnoMes(dados.dados);

    return {
      titulo,
      periodo: dados.cabecalho
        ? `${dados.cabecalho.dataInicio} a ${dados.cabecalho.dataFim}`
        : undefined,
      abas: [
        {
          nome: 'Resumo',
          linhas: this.linhasCabecalhoPrazo(dados.cabecalho),
        },
        {
          nome: 'Processos',
          linhas: linhas.map((item: any) => this.linhaPrazoAnalise(item)),
        },
      ],
    };
  }

  private linhasCabecalhoPrazo(cabecalho: any): LinhaExportacao[] {
    if (!cabecalho) return [];

    return [
      { Indicador: 'Periodo', Valor: `${cabecalho.dataInicio} a ${cabecalho.dataFim}` },
      { Indicador: 'Analises finalizadas', Valor: cabecalho.qtdAnaliseFinalizada },
      { Indicador: 'No prazo', Valor: cabecalho.qtdAnaliseNoPrazo },
      { Indicador: 'Excedidas', Valor: cabecalho.qtdAnaliseExcedido },
      { Indicador: 'Prazo fixo de analise', Valor: cabecalho.prazoFixoAnalise },
      { Indicador: 'Media de tempo para analise', Valor: cabecalho.mediaPeriodoAnalise },
      { Indicador: 'Media de tempo para reconsideracao', Valor: cabecalho.mediaPeriodoReconsideracao },
    ];
  }

  private linhaPrazoAnalise(item: any): LinhaExportacao {
    return {
      Ano: item.ano ?? '',
      Mes: item.mes ?? '',
      Processo: item.processo_fisico ?? item.sei ?? item.aprova_digital ?? '',
      'Data do protocolo': this.valorParaCelula(item.data_protocolo),
      'Data da publicacao': this.valorParaCelula(item.envio_admissibilidade),
      'Pedido de reconsideracao': item.reconsiderado ? 'Sim' : 'Nao',
      'Tempo 1a analise (dias)': item.tempo_de_analise_admissibilidade ?? '',
      'Tempo reconsideracao (dias)': item.tempo_de_analise_reconsideracao ?? '',
      'Suspensao 1a analise (dias)': item.suspensao_prazo_etapa_1 ?? '',
      'Suspensao 2a analise (dias)': item.suspensao_prazo_etapa_2 ?? '',
      'Motivos suspensao': Array.isArray(item.motivos_suspensao)
        ? item.motivos_suspensao.join(', ')
        : '',
    };
  }

  private montarGabinetePrefeito(dados: any[]): RelatorioExportacao {
    const linhas = dados.flatMap((anoData) =>
      this.mesesAbreviados().flatMap((mes) =>
        (anoData[mes] ?? []).map((processo: any) => ({
          Ano: anoData.ano,
          Mes: mes,
          'Processos protocolados no mes': anoData[mes]?.length ?? 0,
          'Processos aprovados no mes': (anoData[mes] ?? []).filter((p: any) => p.status === 3).length,
          Processo: processo.numero_do_processo ?? processo.sei ?? processo.aprova_digital ?? '',
          Status: this.nomeStatus(processo.status),
          'Tempo pedido inicial (dias)': processo.tempo_de_analise_pedido_inicial ?? '',
          'Tempo recurso (dias)': processo.tempo_de_analise_recurso ?? '',
          'Categoria de uso': processo.requerimento ?? '',
          'Responsavel pelo projeto': processo.responsavel_tecnico_id ?? '',
          Empresa: processo.proprietario_id ?? '',
          'Caracteristicas do projeto': processo.resumo_projeto ?? processo.obs ?? '',
          'Regiao da cidade': processo.zona ?? '',
        })),
      ),
    );

    return {
      titulo: 'Aprova Rapido - Controle Gabinete Prefeito',
      abas: [
        {
          nome: 'Resumo anual',
          linhas: dados.map((item) => ({
            Ano: item.ano,
            'Processos protocolados': item.processos_protocolados,
            'Processos aprovados': item.processos_aprovados,
          })),
        },
        {
          nome: 'Processos',
          linhas,
        },
      ],
    };
  }

  private extrairAbas(nome: string, valor: unknown): AbaExportacao[] {
    if (Array.isArray(valor)) {
      if (valor.every((item) => this.ehObjeto(item))) {
        return [{ nome, linhas: valor.map((item) => this.achatarObjeto(item)) }];
      }

      return [{ nome, linhas: valor.map((item, index) => ({ item: index + 1, valor: this.valorParaCelula(item) })) }];
    }

    if (!this.ehObjeto(valor)) {
      return [{ nome, linhas: [{ valor: this.valorParaCelula(valor) }] }];
    }

    const resumo: LinhaExportacao[] = [];
    const abas: AbaExportacao[] = [];

    for (const [chave, item] of Object.entries(valor)) {
      if (Array.isArray(item)) {
        abas.push(...this.extrairAbas(`${nome} - ${this.titulo(chave)}`, item));
      } else if (this.ehObjeto(item)) {
        const subAbas = this.extrairAbas(`${nome} - ${this.titulo(chave)}`, item);
        if (subAbas.length === 1 && subAbas[0].linhas.length === 1) {
          resumo.push({ campo: chave, valor: JSON.stringify(item) });
        } else {
          abas.push(...subAbas);
        }
      } else {
        resumo.push({ campo: chave, valor: this.valorParaCelula(item) });
      }
    }

    if (resumo.length > 0) {
      abas.unshift({ nome, linhas: resumo });
    }

    return abas.length > 0 ? abas : [{ nome, linhas: [] }];
  }

  private achatarObjeto(valor: unknown, prefixo = ''): LinhaExportacao {
    const linha: LinhaExportacao = {};

    if (!this.ehObjeto(valor)) return { valor: this.valorParaCelula(valor) };

    for (const [chave, item] of Object.entries(valor)) {
      const novaChave = prefixo ? `${prefixo}.${chave}` : chave;

      if (this.ehObjeto(item) && !this.ehDate(item)) {
        Object.assign(linha, this.achatarObjeto(item, novaChave));
      } else if (Array.isArray(item)) {
        linha[novaChave] = item.length;
      } else {
        linha[novaChave] = this.valorParaCelula(item);
      }
    }

    return linha;
  }

  private colunas(linhas: LinhaExportacao[]): string[] {
    return Array.from(
      linhas.reduce((acc, linha) => {
        Object.keys(linha).forEach((chave) => acc.add(chave));
        return acc;
      }, new Set<string>()),
    );
  }

  private flattenDadosPorAnoMes(dados: any): any[] {
    if (!dados || typeof dados !== 'object') return [];

    return Object.values(dados).flatMap((meses: any) =>
      Object.values(meses ?? {}).flatMap((itens: any) =>
        Array.isArray(itens) ? itens : [],
      ),
    );
  }

  private descreverDetalhamento(dados: any): string {
    if (!dados || typeof dados !== 'object') return '';

    return Object.entries(dados)
      .map(([chave, valor]) => `${chave}: ${valor}`)
      .join(' | ');
  }

  private nomeMes(indice: number): string {
    return new Date(2000, indice, 1).toLocaleDateString('pt-BR', {
      month: 'long',
    });
  }

  private mesesAbreviados(): string[] {
    return ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
  }

  private nomeStatus(status: number | null | undefined): string {
    const nomes: Record<number, string> = {
      0: 'Em analise de admissibilidade',
      1: 'Inadmitido',
      2: 'Em analise',
      3: 'Deferido',
      4: 'Indeferido',
    };

    return status === null || status === undefined ? '' : nomes[status] ?? String(status);
  }

  private larguraColuna(coluna: string, linhas: LinhaExportacao[]): number {
    const maiorConteudo = linhas.reduce((maior, linha) => {
      const valor = String(linha[coluna] ?? '');
      return Math.max(maior, valor.length);
    }, coluna.length);

    return Math.min(Math.max(maiorConteudo + 3, 12), 45);
  }

  private dividirColunasPdf(colunas: string[]): string[][] {
    const limite = colunas.length > 9 ? 7 : 10;
    const blocos: string[][] = [];

    for (let i = 0; i < colunas.length; i += limite) {
      blocos.push(colunas.slice(i, i + limite));
    }

    return blocos;
  }

  private extrairPeriodo(params: ExportarRelatorioParams): { dataInicial: string; dataFinal: string } {
    if (params.dataInicial && params.dataFinal) {
      return { dataInicial: params.dataInicial, dataFinal: params.dataFinal };
    }

    if (params.periodo) {
      const [dataInicial, dataFinal] = params.periodo.split(',');
      if (dataInicial && dataFinal) return { dataInicial, dataFinal };
    }

    throw new BadRequestException('Periodo obrigatorio para exportar este relatorio.');
  }

  private extrairMesAno(valor?: string): { mes: string; ano: string } {
    if (!valor) {
      const hoje = new Date();
      return { mes: String(hoje.getMonth() + 1), ano: String(hoje.getFullYear()) };
    }

    const data = valor.includes(',') ? valor.split(',').at(-1) : valor;
    const partes = data.split('-');

    if (partes.length !== 3) {
      throw new BadRequestException('Periodo invalido para relatorio quantitativo.');
    }

    return { mes: partes[1], ano: partes[2] };
  }

  private normalizarFormato(formato: string): FormatoExportacao {
    const normalizado = formato.toLowerCase();
    if (normalizado === 'excel' || normalizado === 'xlsx') return 'excel';
    if (normalizado === 'pdf') return 'pdf';

    throw new BadRequestException('Formato de exportacao invalido.');
  }

  private valorParaCelula(valor: unknown): string | number | boolean | null {
    if (valor === undefined || valor === null) return null;
    if (valor instanceof Date) return valor.toLocaleDateString('pt-BR');
    if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean') return valor;
    return JSON.stringify(valor);
  }

  private ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
  }

  private ehDate(valor: unknown): valor is Date {
    return valor instanceof Date;
  }

  private nomeAba(nome: string): string {
    return nome.replace(/[\\/*?:[\]]/g, '').slice(0, 31) || 'Relatorio';
  }

  private nomeAbaUnico(nome: string, usados: Set<string>): string {
    const base = this.nomeAba(nome);
    let candidato = base;
    let contador = 2;

    while (usados.has(candidato)) {
      const sufixo = ` ${contador}`;
      candidato = `${base.slice(0, 31 - sufixo.length)}${sufixo}`;
      contador += 1;
    }

    usados.add(candidato);
    return candidato;
  }

  private titulo(valor: string): string {
    return valor
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  }

  private slug(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  private dataArquivo(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
