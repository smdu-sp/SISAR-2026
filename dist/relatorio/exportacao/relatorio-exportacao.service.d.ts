import { RelatorioService } from '../relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from '../relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from '../ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from '../relatorio-complementar/relatorio-complementar.service';
interface ExportarRelatorioParams {
    dataInicial?: string;
    dataFinal?: string;
    anoInicial?: string;
    anoFinal?: string;
    periodo?: string;
}
export declare class RelatorioExportacaoService {
    private readonly relatorioService;
    private readonly relatorioRRService;
    private readonly arGraficoProgressaoMensal;
    private readonly relatorioComplementarService;
    constructor(relatorioService: RelatorioService, relatorioRRService: RelatorioRRService, arGraficoProgressaoMensal: ArGraficoProgressaoMensalService, relatorioComplementarService: RelatorioComplementarService);
    exportar(tipoRelatorio: string, formato: string, params: ExportarRelatorioParams): Promise<{
        buffer: Buffer;
        filename: string;
        contentType: string;
    }>;
    private montarRelatorio;
    private gerarExcel;
    private readonly PDF_CORES;
    private gerarPdf;
    /** Alinha a coluna à direita quando todos os valores preenchidos são numéricos. */
    private alinhamentoColunaPdf;
    private normalizarRelatorio;
    private montarQuantitativo;
    private montarAbasStatusQuantitativo;
    private linhasStatus;
    private montarPrazoAnalise;
    private linhasCabecalhoPrazo;
    private linhaPrazoAnalise;
    private montarGabinetePrefeito;
    private extrairAbas;
    private achatarObjeto;
    private colunas;
    private flattenDadosPorAnoMes;
    private descreverDetalhamento;
    private nomeMes;
    private mesesAbreviados;
    private nomeStatus;
    private larguraColuna;
    private dividirColunasPdf;
    private extrairPeriodo;
    private extrairMesAno;
    private normalizarFormato;
    private valorParaCelula;
    private ehObjeto;
    private ehDate;
    private nomeAba;
    private nomeAbaUnico;
    private titulo;
    private slug;
    private dataArquivo;
}
export {};
