"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioExportacaoService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const path = require("path");
const relatorio_ar_service_1 = require("../relatorio-ar-quantitativo/relatorio-ar.service");
const relatorio_rr_service_1 = require("../relatorio-rr-quantitativo/relatorio-rr.service");
const ar_grafico_progressao_mensal_service_1 = require("../ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service");
const relatorio_complementar_service_1 = require("../relatorio-complementar/relatorio-complementar.service");
let RelatorioExportacaoService = class RelatorioExportacaoService {
    constructor(relatorioService, relatorioRRService, arGraficoProgressaoMensal, relatorioComplementarService) {
        this.relatorioService = relatorioService;
        this.relatorioRRService = relatorioRRService;
        this.arGraficoProgressaoMensal = arGraficoProgressaoMensal;
        this.relatorioComplementarService = relatorioComplementarService;
        this.PDF_CORES = {
            marca: '#15859e',
            marcaEscura: '#0e6273',
            faixaTextoSecundario: '#cdeef4',
            zebra: '#eef6f8',
            borda: '#d6e6ea',
            texto: '#1f2a2d',
            suave: '#66787d',
            branco: '#ffffff',
        };
    }
    async exportar(tipoRelatorio, formato, params) {
        const formatoNormalizado = this.normalizarFormato(formato);
        const relatorio = await this.montarRelatorio(tipoRelatorio, params);
        const extensao = formatoNormalizado === 'excel' ? 'xlsx' : 'pdf';
        const filename = `${this.slug(tipoRelatorio)}-${this.dataArquivo()}.${extensao}`;
        if (formatoNormalizado === 'excel') {
            return {
                buffer: await this.gerarExcel(relatorio),
                filename,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
        }
        return {
            buffer: await this.gerarPdf(relatorio),
            filename,
            contentType: 'application/pdf',
        };
    }
    async montarRelatorio(tipoRelatorio, params) {
        switch (tipoRelatorio) {
            case 'ar-quantitativo': {
                const { mes, ano } = this.extrairMesAno(params.dataFinal ?? params.dataInicial ?? params.periodo);
                const dados = await this.relatorioService.getRelatorio(mes, ano);
                return this.montarQuantitativo('Aprova Rapido - Status e Resumo Quantitativo', dados, `${mes}/${ano}`);
            }
            case 'rr-quantitativo': {
                const { mes, ano } = this.extrairMesAno(params.dataInicial ?? params.dataFinal ?? params.periodo);
                const dados = await this.relatorioRRService.getRelatorio(mes, ano);
                return this.montarQuantitativo('Requalifica Rapido - Status e Resumo Quantitativo', dados, `${mes}/${ano}`);
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
                            linhas: dados.flatMap((item) => item.mes.map((mensal, index) => ({
                                ano: item.ano,
                                mes: this.nomeMes(index),
                                'Protocolados no mes': mensal,
                                'Protocolados acumulados': item.acc[index],
                            }))),
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
                return this.montarPrazoAnalise('Aprova Rapido - Analise de Admissibilidade', dados);
            }
            case 'rr-analise-admissibilidade': {
                const { dataInicial, dataFinal } = this.extrairPeriodo(params);
                const dados = await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeRR(dataInicial, dataFinal);
                return this.montarPrazoAnalise('Requalifica Rapido - Analise de Admissibilidade', dados);
            }
            default:
                throw new common_1.BadRequestException('Tipo de relatorio invalido.');
        }
    }
    async gerarExcel(relatorio) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'SISAR';
        workbook.created = new Date();
        const nomesAbas = new Set();
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
                if (relatorio.periodo)
                    worksheet.mergeCells(3, 1, 3, colunas.length);
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
    async gerarPdf(relatorio) {
        const pdfmake = require('pdfmake');
        const fonteBase = path.join(path.dirname(require.resolve('pdfmake/package.json')), 'fonts', 'Roboto');
        pdfmake.setFonts({
            Roboto: {
                normal: path.join(fonteBase, 'Roboto-Regular.ttf'),
                bold: path.join(fonteBase, 'Roboto-Medium.ttf'),
                italics: path.join(fonteBase, 'Roboto-Italic.ttf'),
                bolditalics: path.join(fonteBase, 'Roboto-MediumItalic.ttf'),
            },
        });
        pdfmake.setLocalAccessPolicy((filePath) => filePath.startsWith(fonteBase));
        pdfmake.setUrlAccessPolicy(() => false);
        const cor = this.PDF_CORES;
        const geradoEm = new Date().toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        const subinfo = [];
        if (relatorio.periodo)
            subinfo.push(`Período: ${relatorio.periodo}`);
        subinfo.push(`Gerado em ${geradoEm}`);
        const content = [
            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                border: [false, false, false, false],
                                fillColor: cor.marca,
                                stack: [
                                    { text: relatorio.titulo, color: cor.branco, bold: true, fontSize: 16 },
                                    {
                                        text: subinfo.join('   ·   '),
                                        color: cor.faixaTextoSecundario,
                                        fontSize: 9,
                                        margin: [0, 4, 0, 0],
                                    },
                                ],
                            },
                        ],
                    ],
                },
                layout: {
                    defaultBorder: false,
                    paddingLeft: () => 16,
                    paddingRight: () => 16,
                    paddingTop: () => 14,
                    paddingBottom: () => 14,
                },
                margin: [0, 0, 0, 16],
            },
        ];
        for (const aba of relatorio.abas) {
            const colunas = this.colunas(aba.linhas);
            content.push({
                table: {
                    widths: [3, 'auto'],
                    body: [
                        [
                            { text: '', fillColor: cor.marca, border: [false, false, false, false] },
                            {
                                text: aba.nome,
                                bold: true,
                                fontSize: 11,
                                color: cor.marcaEscura,
                                margin: [8, 0, 0, 0],
                                border: [false, false, false, false],
                            },
                        ],
                    ],
                },
                layout: { defaultBorder: false, paddingLeft: () => 0, paddingTop: () => 0, paddingBottom: () => 0 },
                margin: [0, 6, 0, 6],
            });
            if (colunas.length === 0) {
                content.push({
                    text: 'Sem dados para o período selecionado.',
                    italics: true,
                    color: cor.suave,
                    margin: [0, 0, 0, 10],
                });
                continue;
            }
            for (const bloco of this.dividirColunasPdf(colunas)) {
                const alinhamentos = bloco.map((coluna) => this.alinhamentoColunaPdf(coluna, aba.linhas));
                content.push({
                    table: {
                        headerRows: 1,
                        widths: bloco.map(() => '*'),
                        body: [
                            bloco.map((coluna, i) => ({
                                text: coluna,
                                bold: true,
                                color: cor.branco,
                                alignment: alinhamentos[i],
                            })),
                            ...aba.linhas.map((linha) => bloco.map((coluna, i) => ({
                                text: String(linha[coluna] ?? ''),
                                alignment: alinhamentos[i],
                            }))),
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex) => rowIndex === 0
                            ? cor.marca
                            : rowIndex % 2 === 0
                                ? cor.zebra
                                : null,
                        hLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 0 : 0.5,
                        vLineWidth: () => 0,
                        hLineColor: () => cor.borda,
                        paddingLeft: () => 7,
                        paddingRight: () => 7,
                        paddingTop: () => 5,
                        paddingBottom: () => 5,
                    },
                    margin: [0, 0, 0, 12],
                });
            }
        }
        const pdf = pdfmake.createPdf({
            pageOrientation: 'landscape',
            pageSize: 'A4',
            pageMargins: [24, 40, 24, 34],
            defaultStyle: {
                font: 'Roboto',
                fontSize: 8,
                color: cor.texto,
            },
            header: (currentPage) => currentPage === 1
                ? null
                : {
                    margin: [24, 16, 24, 0],
                    columns: [
                        { text: relatorio.titulo, fontSize: 8, bold: true, color: cor.suave },
                        { text: `Gerado em ${geradoEm}`, alignment: 'right', fontSize: 8, color: cor.suave },
                    ],
                },
            footer: (currentPage, pageCount) => ({
                margin: [24, 8, 24, 0],
                columns: [
                    {
                        text: 'SISAR · Sistema de Acompanhamento de Processos',
                        fontSize: 7,
                        color: cor.suave,
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        alignment: 'right',
                        fontSize: 7,
                        color: cor.suave,
                    },
                ],
            }),
            content,
        });
        return await pdf.getBuffer();
    }
    alinhamentoColunaPdf(coluna, linhas) {
        let algumValor = false;
        for (const linha of linhas) {
            const valor = linha[coluna];
            if (valor === null || valor === undefined || valor === '')
                continue;
            algumValor = true;
            const texto = String(valor).trim().replace(/\./g, '').replace(',', '.');
            if (!/^-?\d+(\.\d+)?%?$/.test(texto))
                return 'left';
        }
        return algumValor ? 'right' : 'left';
    }
    normalizarRelatorio(titulo, dados) {
        return {
            titulo,
            abas: this.extrairAbas('Resumo', dados),
        };
    }
    montarQuantitativo(titulo, dados, periodo) {
        const abas = [
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
    montarAbasStatusQuantitativo(dados) {
        const secoes = [
            ['Em analise', dados.em_analise],
            ['Deferidos', dados.deferidos],
            ['Indeferidos', dados.indeferidos],
        ];
        return secoes.map(([nome, secao]) => ({
            nome,
            linhas: this.linhasStatus(secao),
        }));
    }
    linhasStatus(secao) {
        if (!secao)
            return [];
        return Object.entries(secao).map(([orgao, detalhe]) => ({
            Orgao: orgao.toUpperCase(),
            Quantidade: detalhe?.quantidade ?? 0,
            Detalhamento: this.descreverDetalhamento(detalhe?.data),
        }));
    }
    montarPrazoAnalise(titulo, dados) {
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
                    linhas: linhas.map((item) => this.linhaPrazoAnalise(item)),
                },
            ],
        };
    }
    linhasCabecalhoPrazo(cabecalho) {
        if (!cabecalho)
            return [];
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
    linhaPrazoAnalise(item) {
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
    montarGabinetePrefeito(dados) {
        const linhas = dados.flatMap((anoData) => this.mesesAbreviados().flatMap((mes) => (anoData[mes] ?? []).map((processo) => ({
            Ano: anoData.ano,
            Mes: mes,
            'Processos protocolados no mes': anoData[mes]?.length ?? 0,
            'Processos aprovados no mes': (anoData[mes] ?? []).filter((p) => p.status === 3).length,
            Processo: processo.numero_do_processo ?? processo.sei ?? processo.aprova_digital ?? '',
            Status: this.nomeStatus(processo.status),
            'Tempo pedido inicial (dias)': processo.tempo_de_analise_pedido_inicial ?? '',
            'Tempo recurso (dias)': processo.tempo_de_analise_recurso ?? '',
            'Categoria de uso': processo.requerimento ?? '',
            'Responsavel pelo projeto': processo.responsavel_tecnico_id ?? '',
            Empresa: processo.proprietario_id ?? '',
            'Caracteristicas do projeto': processo.resumo_projeto ?? processo.obs ?? '',
            'Regiao da cidade': processo.zona ?? '',
        }))));
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
    extrairAbas(nome, valor) {
        if (Array.isArray(valor)) {
            if (valor.every((item) => this.ehObjeto(item))) {
                return [{ nome, linhas: valor.map((item) => this.achatarObjeto(item)) }];
            }
            return [{ nome, linhas: valor.map((item, index) => ({ item: index + 1, valor: this.valorParaCelula(item) })) }];
        }
        if (!this.ehObjeto(valor)) {
            return [{ nome, linhas: [{ valor: this.valorParaCelula(valor) }] }];
        }
        const resumo = [];
        const abas = [];
        for (const [chave, item] of Object.entries(valor)) {
            if (Array.isArray(item)) {
                abas.push(...this.extrairAbas(`${nome} - ${this.titulo(chave)}`, item));
            }
            else if (this.ehObjeto(item)) {
                const subAbas = this.extrairAbas(`${nome} - ${this.titulo(chave)}`, item);
                if (subAbas.length === 1 && subAbas[0].linhas.length === 1) {
                    resumo.push({ campo: chave, valor: JSON.stringify(item) });
                }
                else {
                    abas.push(...subAbas);
                }
            }
            else {
                resumo.push({ campo: chave, valor: this.valorParaCelula(item) });
            }
        }
        if (resumo.length > 0) {
            abas.unshift({ nome, linhas: resumo });
        }
        return abas.length > 0 ? abas : [{ nome, linhas: [] }];
    }
    achatarObjeto(valor, prefixo = '') {
        const linha = {};
        if (!this.ehObjeto(valor))
            return { valor: this.valorParaCelula(valor) };
        for (const [chave, item] of Object.entries(valor)) {
            const novaChave = prefixo ? `${prefixo}.${chave}` : chave;
            if (this.ehObjeto(item) && !this.ehDate(item)) {
                Object.assign(linha, this.achatarObjeto(item, novaChave));
            }
            else if (Array.isArray(item)) {
                linha[novaChave] = item.length;
            }
            else {
                linha[novaChave] = this.valorParaCelula(item);
            }
        }
        return linha;
    }
    colunas(linhas) {
        return Array.from(linhas.reduce((acc, linha) => {
            Object.keys(linha).forEach((chave) => acc.add(chave));
            return acc;
        }, new Set()));
    }
    flattenDadosPorAnoMes(dados) {
        if (!dados || typeof dados !== 'object')
            return [];
        return Object.values(dados).flatMap((meses) => Object.values(meses ?? {}).flatMap((itens) => Array.isArray(itens) ? itens : []));
    }
    descreverDetalhamento(dados) {
        if (!dados || typeof dados !== 'object')
            return '';
        return Object.entries(dados)
            .map(([chave, valor]) => `${chave}: ${valor}`)
            .join(' | ');
    }
    nomeMes(indice) {
        return new Date(2000, indice, 1).toLocaleDateString('pt-BR', {
            month: 'long',
        });
    }
    mesesAbreviados() {
        return ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
    }
    nomeStatus(status) {
        const nomes = {
            0: 'Em analise de admissibilidade',
            1: 'Inadmitido',
            2: 'Em analise',
            3: 'Deferido',
            4: 'Indeferido',
        };
        return status === null || status === undefined ? '' : nomes[status] ?? String(status);
    }
    larguraColuna(coluna, linhas) {
        const maiorConteudo = linhas.reduce((maior, linha) => {
            const valor = String(linha[coluna] ?? '');
            return Math.max(maior, valor.length);
        }, coluna.length);
        return Math.min(Math.max(maiorConteudo + 3, 12), 45);
    }
    dividirColunasPdf(colunas) {
        const limite = colunas.length > 9 ? 7 : 10;
        const blocos = [];
        for (let i = 0; i < colunas.length; i += limite) {
            blocos.push(colunas.slice(i, i + limite));
        }
        return blocos;
    }
    extrairPeriodo(params) {
        if (params.dataInicial && params.dataFinal) {
            return { dataInicial: params.dataInicial, dataFinal: params.dataFinal };
        }
        if (params.periodo) {
            const [dataInicial, dataFinal] = params.periodo.split(',');
            if (dataInicial && dataFinal)
                return { dataInicial, dataFinal };
        }
        throw new common_1.BadRequestException('Periodo obrigatorio para exportar este relatorio.');
    }
    extrairMesAno(valor) {
        if (!valor) {
            const hoje = new Date();
            return { mes: String(hoje.getMonth() + 1), ano: String(hoje.getFullYear()) };
        }
        const data = valor.includes(',') ? valor.split(',').at(-1) : valor;
        const partes = data.split('-');
        if (partes.length !== 3) {
            throw new common_1.BadRequestException('Periodo invalido para relatorio quantitativo.');
        }
        return { mes: partes[1], ano: partes[2] };
    }
    normalizarFormato(formato) {
        const normalizado = formato.toLowerCase();
        if (normalizado === 'excel' || normalizado === 'xlsx')
            return 'excel';
        if (normalizado === 'pdf')
            return 'pdf';
        throw new common_1.BadRequestException('Formato de exportacao invalido.');
    }
    valorParaCelula(valor) {
        if (valor === undefined || valor === null)
            return null;
        if (valor instanceof Date)
            return valor.toLocaleDateString('pt-BR');
        if (typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean')
            return valor;
        return JSON.stringify(valor);
    }
    ehObjeto(valor) {
        return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
    }
    ehDate(valor) {
        return valor instanceof Date;
    }
    nomeAba(nome) {
        return nome.replace(/[\\/*?:[\]]/g, '').slice(0, 31) || 'Relatorio';
    }
    nomeAbaUnico(nome, usados) {
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
    titulo(valor) {
        return valor
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letra) => letra.toUpperCase());
    }
    slug(valor) {
        return valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase();
    }
    dataArquivo() {
        return new Date().toISOString().slice(0, 10);
    }
};
exports.RelatorioExportacaoService = RelatorioExportacaoService;
exports.RelatorioExportacaoService = RelatorioExportacaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [relatorio_ar_service_1.RelatorioService,
        relatorio_rr_service_1.RelatorioRRService,
        ar_grafico_progressao_mensal_service_1.ArGraficoProgressaoMensalService,
        relatorio_complementar_service_1.RelatorioComplementarService])
], RelatorioExportacaoService);
//# sourceMappingURL=relatorio-exportacao.service.js.map