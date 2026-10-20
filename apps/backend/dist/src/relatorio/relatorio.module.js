"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioModule = void 0;
const common_1 = require("@nestjs/common");
const relatorio_controller_1 = require("./relatorio.controller");
const relatorio_ar_service_1 = require("./relatorio-ar-quantitativo/relatorio-ar.service");
const relatorio_rr_service_1 = require("./relatorio-rr-quantitativo/relatorio-rr.service");
const ar_grafico_progressao_mensal_service_1 = require("./ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service");
const relatorio_complementar_service_1 = require("./relatorio-complementar/relatorio-complementar.service");
const relatorio_exportacao_service_1 = require("./exportacao/relatorio-exportacao.service");
const email_module_1 = require("../email/email.module");
const relatorio_email_service_1 = require("./email/relatorio-email.service");
const relatorio_agendamento_controller_1 = require("./agendamento/relatorio-agendamento.controller");
const relatorio_agendamento_service_1 = require("./agendamento/relatorio-agendamento.service");
const relatorio_agendamento_scheduler_1 = require("./agendamento/relatorio-agendamento.scheduler");
let RelatorioModule = class RelatorioModule {
};
exports.RelatorioModule = RelatorioModule;
exports.RelatorioModule = RelatorioModule = __decorate([
    (0, common_1.Module)({
        imports: [email_module_1.EmailModule],
        controllers: [relatorio_controller_1.RelatorioController, relatorio_agendamento_controller_1.RelatorioAgendamentoController],
        providers: [
            relatorio_ar_service_1.RelatorioService,
            relatorio_rr_service_1.RelatorioRRService,
            ar_grafico_progressao_mensal_service_1.ArGraficoProgressaoMensalService,
            relatorio_complementar_service_1.RelatorioComplementarService,
            relatorio_exportacao_service_1.RelatorioExportacaoService,
            relatorio_email_service_1.RelatorioEmailService,
            relatorio_agendamento_service_1.RelatorioAgendamentoService,
            relatorio_agendamento_scheduler_1.RelatorioAgendamentoScheduler,
        ],
    })
], RelatorioModule);
//# sourceMappingURL=relatorio.module.js.map