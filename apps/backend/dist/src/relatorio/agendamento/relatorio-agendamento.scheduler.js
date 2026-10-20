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
var RelatorioAgendamentoScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioAgendamentoScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const relatorio_agendamento_service_1 = require("./relatorio-agendamento.service");
let RelatorioAgendamentoScheduler = RelatorioAgendamentoScheduler_1 = class RelatorioAgendamentoScheduler {
    constructor(agendamentoService) {
        this.agendamentoService = agendamentoService;
        this.logger = new common_1.Logger(RelatorioAgendamentoScheduler_1.name);
        this.executando = false;
    }
    async verificarVencidos() {
        if (this.executando)
            return;
        this.executando = true;
        try {
            await this.agendamentoService.executarVencidos();
        }
        catch (e) {
            this.logger.error(`Erro ao processar agendamentos de relatórios: ${e instanceof Error ? e.message : e}`);
        }
        finally {
            this.executando = false;
        }
    }
};
exports.RelatorioAgendamentoScheduler = RelatorioAgendamentoScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RelatorioAgendamentoScheduler.prototype, "verificarVencidos", null);
exports.RelatorioAgendamentoScheduler = RelatorioAgendamentoScheduler = RelatorioAgendamentoScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [relatorio_agendamento_service_1.RelatorioAgendamentoService])
], RelatorioAgendamentoScheduler);
//# sourceMappingURL=relatorio-agendamento.scheduler.js.map