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
exports.RelatorioAgendamentoController = void 0;
const recurso_decorator_1 = require("../../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const usuario_atual_decorator_1 = require("../../auth/decorators/usuario-atual.decorator");
const relatorio_agendamento_service_1 = require("./relatorio-agendamento.service");
const create_relatorio_agendamento_dto_1 = require("./dto/create-relatorio-agendamento.dto");
const update_relatorio_agendamento_dto_1 = require("./dto/update-relatorio-agendamento.dto");
let RelatorioAgendamentoController = class RelatorioAgendamentoController {
    constructor(service) {
        this.service = service;
    }
    listar() {
        return this.service.listar();
    }
    statusEmail() {
        return this.service.statusEmail();
    }
    buscarPorId(id) {
        return this.service.buscarPorId(id);
    }
    historico(id) {
        return this.service.historico(id);
    }
    criar(dto, usuario) {
        return this.service.criar(dto, usuario?.id);
    }
    atualizar(id, dto) {
        return this.service.atualizar(id, dto);
    }
    executarAgora(id) {
        return this.service.executarAgora(id);
    }
    remover(id) {
        return this.service.remover(id);
    }
};
exports.RelatorioAgendamentoController = RelatorioAgendamentoController;
__decorate([
    (0, common_1.Get)(),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista os envios agendados de relatórios.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('status-email'),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Informa se o envio de e-mail está configurado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "statusEmail", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Busca um envio agendado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Get)(':id/historico'),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Últimas execuções (sucesso ou falha) do envio agendado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "historico", null);
__decorate([
    (0, common_1.Post)(),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cria um envio agendado.',
        description: 'Ex.: todo dia 5 do mês, 08:00, relatório X em PDF e Excel para os e-mails informados.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_relatorio_agendamento_dto_1.CreateRelatorioAgendamentoDto, Object]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "criar", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza um envio agendado (inclusive ativar/desativar).' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_relatorio_agendamento_dto_1.UpdateRelatorioAgendamentoDto]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Post)(':id/executar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({
        summary: 'Dispara o envio agora, sem alterar a programação.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "executarAgora", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, recurso_decorator_1.Recurso)('envio_relatorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove um envio agendado e seu histórico.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RelatorioAgendamentoController.prototype, "remover", null);
exports.RelatorioAgendamentoController = RelatorioAgendamentoController = __decorate([
    (0, swagger_1.ApiTags)('Relatórios - Envio agendado'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, common_1.Controller)('relatorio-agendamentos'),
    __metadata("design:paramtypes", [relatorio_agendamento_service_1.RelatorioAgendamentoService])
], RelatorioAgendamentoController);
//# sourceMappingURL=relatorio-agendamento.controller.js.map