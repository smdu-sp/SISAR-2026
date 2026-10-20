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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_relatorio_dto_1 = require("./relatorio-ar-quantitativo/dto/response-relatorio.dto");
const relatorio_ar_service_1 = require("./relatorio-ar-quantitativo/relatorio-ar.service");
const relatorio_rr_service_1 = require("./relatorio-rr-quantitativo/relatorio-rr.service");
const ar_grafico_progressao_mensal_service_1 = require("./ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service");
const relatorio_complementar_service_1 = require("./relatorio-complementar/relatorio-complementar.service");
const relatorio_exportacao_service_1 = require("./exportacao/relatorio-exportacao.service");
const enviar_relatorio_email_dto_1 = require("./dto/enviar-relatorio-email.dto");
const relatorio_email_service_1 = require("./email/relatorio-email.service");
let RelatorioController = class RelatorioController {
    constructor(relatorioService, relatorioRRService, arGraficoProgressaoMensal, relatorioComplementarService, relatorioExportacaoService, relatorioEmailService) {
        this.relatorioService = relatorioService;
        this.relatorioRRService = relatorioRRService;
        this.arGraficoProgressaoMensal = arGraficoProgressaoMensal;
        this.relatorioComplementarService = relatorioComplementarService;
        this.relatorioExportacaoService = relatorioExportacaoService;
        this.relatorioEmailService = relatorioEmailService;
    }
    async relatorioQuantitativo(mes, ano) {
        return await this.relatorioService.getRelatorio(mes, ano);
    }
    async relatorioRequalificaRapido(mes, ano) {
        return await this.relatorioRRService.getRelatorio(mes, ano);
    }
    async relatorioArGraficoProgressaoMensalIntervalo(anoInicial, anoFinal) {
        return await this.arGraficoProgressaoMensal.getByYearRange(Number(anoInicial), Number(anoFinal));
    }
    async relatorioArGraficoProgressaoMensal(ano) {
        return await this.arGraficoProgressaoMensal.getAllByYear(Number(ano));
    }
    async relatorioArPrazoAnaliseAdmissibilidade(dataInicial, dataFinal) {
        return await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeAR(dataInicial, dataFinal);
    }
    async relatorioRrPrazoAnaliseAdmissibilidade(dataInicial, dataFinal) {
        return await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeRR(dataInicial, dataFinal);
    }
    async relatorioArGabinetePrefeito() {
        return await this.relatorioComplementarService.getGabinetePrefeito();
    }
    async exportarRelatorio(tipoRelatorio, formato, dataInicial, dataFinal, anoInicial, anoFinal, periodo, res) {
        const arquivo = await this.relatorioExportacaoService.exportar(tipoRelatorio, formato, {
            dataInicial,
            dataFinal,
            anoInicial,
            anoFinal,
            periodo,
        });
        res.setHeader('Content-Type', arquivo.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${arquivo.filename}"`);
        res.setHeader('Content-Length', arquivo.buffer.length);
        return res.send(arquivo.buffer);
    }
    async enviarRelatorioPorEmail(tipoRelatorio, formato, dto) {
        return this.relatorioEmailService.enviar(tipoRelatorio, formato, dto);
    }
};
exports.RelatorioController = RelatorioController;
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)("ar/quantitativo/:mes?/:ano?"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar o relatório Aprova Rápido com sucesso.', type: response_relatorio_dto_1.RelatorioResopnseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar o relatório Aprova Rápido.", summary: 'Busque relatório Aprova Rápido.' }),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('ano')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioQuantitativo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)("rr/quantitativo/:mes/:ano"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar o relatório Requalifica Rápido com sucesso.', type: response_relatorio_dto_1.RelatorioResopnseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar o relatório Requalifica Rápido.", summary: 'Busque relatório Requalifica Rápido.' }),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('ano')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioRequalificaRapido", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('ar/progressao-mensal/:anoInicial/:anoFinal'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'anoInicial', type: 'string', example: '2024', required: true }),
    (0, swagger_1.ApiParam)({ name: 'anoFinal', type: 'string', example: '2026', required: true }),
    (0, swagger_1.ApiOperation)({
        description: 'Buscar o relatório Aprova Rápido - Gráfico de Progressão Mensal por intervalo de anos.',
        summary: 'Relatório AR - Progressão mensal por intervalo.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna a progressão mensal agrupada por ano.',
        schema: {
            example: [
                {
                    ano: 2026,
                    mes: [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    acc: [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se o intervalo de anos for inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('anoInicial')),
    __param(1, (0, common_1.Param)('anoFinal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioArGraficoProgressaoMensalIntervalo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('ar/progressao-mensal/:ano'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'ano', type: 'string', example: '2026', required: true }),
    (0, swagger_1.ApiOperation)({
        description: 'Buscar o relatório Aprova Rápido - Gráfico de Progressão Mensal para um ano.',
        summary: 'Relatório AR - Progressão mensal por ano.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna a progressão mensal do ano informado.',
        schema: {
            example: [
                {
                    ano: 2026,
                    mes: [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    acc: [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se o ano for inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('ano')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioArGraficoProgressaoMensal", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('ar/prazo-analise-admissibilidade/:dataInicial/:dataFinal'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'dataInicial', type: 'string', example: '01-01-2026', required: true }),
    (0, swagger_1.ApiParam)({ name: 'dataFinal', type: 'string', example: '31-12-2026', required: true }),
    (0, swagger_1.ApiOperation)({
        description: 'Buscar o relatório Aprova Rápido - Análise de Admissibilidade no período informado.',
        summary: 'Relatório AR - Prazo de análise de admissibilidade.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna cabeçalho e dados agrupados por ano e mês.',
        schema: {
            example: {
                cabecalho: {
                    prazoFixoAnalise: '15 dias',
                    dataInicio: '01/01/2026',
                    dataFim: '31/12/2026',
                    qtdAnaliseFinalizada: '1',
                    qtdAnaliseNoPrazo: '1',
                    qtdAnaliseExcedido: '0',
                    mediaPeriodoAnalise: '10.0 dias',
                    mediaPeriodoReconsideracao: '0 dias',
                },
                dados: {
                    '2026': {
                        'jan.': [
                            {
                                id: 1,
                                sei: '123456789',
                                ano: 2026,
                                mes: 'jan.',
                                tempo_de_analise_admissibilidade: 10,
                            },
                        ],
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se o período for inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('dataInicial')),
    __param(1, (0, common_1.Param)('dataFinal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioArPrazoAnaliseAdmissibilidade", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('rr/prazo-analise-admissibilidade/:dataInicial/:dataFinal'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'dataInicial', type: 'string', example: '01-01-2026', required: true }),
    (0, swagger_1.ApiParam)({ name: 'dataFinal', type: 'string', example: '31-12-2026', required: true }),
    (0, swagger_1.ApiOperation)({
        description: 'Buscar o relatório Requalifica Rápido - Análise de Admissibilidade no período informado.',
        summary: 'Relatório RR - Prazo de análise de admissibilidade.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna cabeçalho e lista de processos do período.',
        schema: {
            example: {
                cabecalho: {
                    prazoFixoAnalise: '15 dias',
                    dataInicio: '01/01/2026',
                    dataFim: '31/12/2026',
                    qtdAnaliseFinalizada: '1',
                    qtdAnaliseNoPrazo: '1',
                    qtdAnaliseExcedido: '0',
                    mediaPeriodoAnalise: '10.0 dias',
                    mediaPeriodoReconsideracao: '0 dias',
                },
                dados: [
                    {
                        id: 1,
                        sei: '123456789',
                        ano: 2026,
                        mes: 'jan.',
                        tempo_de_analise_admissibilidade: 10,
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se o período for inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('dataInicial')),
    __param(1, (0, common_1.Param)('dataFinal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioRrPrazoAnaliseAdmissibilidade", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('ar/gabinete-do-prefeito'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        description: 'Buscar o relatório Aprova Rápido - Controle Gabinete do Prefeito.',
        summary: 'Relatório AR - Gabinete do Prefeito.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna processos protocolados e aprovados agrupados por ano e mês.',
        schema: {
            example: [
                {
                    ano: 2026,
                    dados: [],
                    'jan.': [
                        {
                            id: 1,
                            sei: '123456789',
                            numero_do_processo: '123456789',
                            tempo_de_analise_pedido_inicial: 10,
                            tempo_de_analise_recurso: null,
                        },
                    ],
                    'fev.': [],
                    'mar.': [],
                    'abr.': [],
                    'mai.': [],
                    'jun.': [],
                    'jul.': [],
                    'ago.': [],
                    'set.': [],
                    'out.': [],
                    'nov.': [],
                    'dez.': [],
                    numeros_de_processos: [],
                    processos_protocolados: 1,
                    processos_aprovados: 0,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "relatorioArGabinetePrefeito", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('relatorios'),
    (0, common_1.Get)('exportar/:tipoRelatorio/:formato'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'tipoRelatorio',
        type: 'string',
        enum: [
            'ar-quantitativo',
            'rr-quantitativo',
            'ar-progressao-mensal',
            'ar-gabinete-prefeito',
            'ar-analise-admissibilidade',
            'rr-analise-admissibilidade',
        ],
        required: true,
    }),
    (0, swagger_1.ApiParam)({ name: 'formato', type: 'string', enum: ['excel', 'pdf'], required: true }),
    (0, swagger_1.ApiOperation)({
        description: 'Exporta o relatório informado no formato solicitado. O arquivo é gerado em memória e retornado como download.',
        summary: 'Exportar relatório.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna o arquivo gerado para download.',
        content: {
            'application/pdf': {
                schema: { type: 'string', format: 'binary' },
            },
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se o tipo, formato ou filtros forem inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('tipoRelatorio')),
    __param(1, (0, common_1.Param)('formato')),
    __param(2, (0, common_1.Query)('dataInicial')),
    __param(3, (0, common_1.Query)('dataFinal')),
    __param(4, (0, common_1.Query)('anoInicial')),
    __param(5, (0, common_1.Query)('anoFinal')),
    __param(6, (0, common_1.Query)('periodo')),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "exportarRelatorio", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, common_1.Post)('enviar-email/:tipoRelatorio/:formato'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'tipoRelatorio',
        type: 'string',
        enum: [
            'ar-quantitativo',
            'rr-quantitativo',
            'ar-progressao-mensal',
            'ar-gabinete-prefeito',
            'ar-analise-admissibilidade',
            'rr-analise-admissibilidade',
        ],
        required: true,
    }),
    (0, swagger_1.ApiParam)({ name: 'formato', type: 'string', enum: ['excel', 'pdf'], required: true }),
    (0, swagger_1.ApiBody)({ type: enviar_relatorio_email_dto_1.EnviarRelatorioEmailDto }),
    (0, swagger_1.ApiOperation)({
        description: 'Gera o relatorio informado em memoria e envia o arquivo como anexo por email usando Resend.',
        summary: 'Enviar relatorio por email.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna os dados do email enviado e o nome do arquivo anexado.',
        schema: {
            example: {
                id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
                filename: 'ar-quantitativo-2026-07-01.xlsx',
                destinatarios: ['usuario@dominio.gov.br'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Retorna 400 se dados, formato ou filtros forem invalidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se nao autorizado.' }),
    __param(0, (0, common_1.Param)('tipoRelatorio')),
    __param(1, (0, common_1.Param)('formato')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, enviar_relatorio_email_dto_1.EnviarRelatorioEmailDto]),
    __metadata("design:returntype", Promise)
], RelatorioController.prototype, "enviarRelatorioPorEmail", null);
exports.RelatorioController = RelatorioController = __decorate([
    (0, common_1.Controller)('relatorio'),
    (0, swagger_1.ApiTags)('Relatórios'),
    __metadata("design:paramtypes", [relatorio_ar_service_1.RelatorioService,
        relatorio_rr_service_1.RelatorioRRService,
        ar_grafico_progressao_mensal_service_1.ArGraficoProgressaoMensalService,
        relatorio_complementar_service_1.RelatorioComplementarService,
        relatorio_exportacao_service_1.RelatorioExportacaoService,
        relatorio_email_service_1.RelatorioEmailService])
], RelatorioController);
//# sourceMappingURL=relatorio.controller.js.map