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
exports.ReunioesController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const reunioes_service_1 = require("./reunioes.service");
const update_reunioes_dto_1 = require("./dto/update-reunioes.dto");
const swagger_1 = require("@nestjs/swagger");
const response_dto_1 = require("./dto/response.dto");
let ReunioesController = class ReunioesController {
    constructor(unidadesService) {
        this.unidadesService = unidadesService;
    }
    listaCompleta() {
        return this.unidadesService.listaCompleta();
    }
    buscarPorMesAno(mes, ano) {
        return this.unidadesService.buscarPorMesAno(parseInt(mes), parseInt(ano));
    }
    buscarPorData(data) {
        return this.unidadesService.buscarPorData(data);
    }
    buscarPorId(id) {
        return this.unidadesService.buscarPorId(id);
    }
    buscarPorInicial(inicialId) {
        return this.unidadesService.buscarPorInicial(+inicialId);
    }
    atualizarData(id, updateReunioesDto) {
        return this.unidadesService.atualizarData(id, updateReunioesDto);
    }
};
exports.ReunioesController = ReunioesController;
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes'),
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar toda a lista com sucesso.', type: [response_dto_1.ReunioesResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as reuniões.", summary: 'Busque reuniões.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "listaCompleta", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes'),
    (0, common_1.Get)('buscar/:mes/:ano'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se filtrando por mês e ano com sucesso.', type: [response_dto_1.ReunioesResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar as reuniões filtradas por mês e ano.", summary: 'Busque reuniões por mês e ano.' }),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('ano')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "buscarPorMesAno", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes'),
    (0, common_1.Get)('buscar-data/:date'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se filtrando por data com sucesso.', type: [response_dto_1.ReunioesResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar as reuniões filtradas por data.", summary: 'Busque reuniões por data.' }),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "buscarPorData", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes'),
    (0, common_1.Get)('buscar-inicial/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar por inicial com sucesso.', type: response_dto_1.ReunioesResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar as reuniões por inicial.", summary: 'Buscar as reuniões por inicial.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes', 'processos'),
    (0, common_1.Get)('por-processo/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reuniões GRAPROEM do processo' }),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "buscarPorInicial", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('reunioes'),
    (0, common_1.Patch)('atualizar-data/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de reunião.', type: response_dto_1.ReunioesResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar por data com sucesso.', type: response_dto_1.ReunioesResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar as reuniões filtradas por data.", summary: 'Busque reuniões por data.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reunioes_dto_1.UpdateReunioesDto]),
    __metadata("design:returntype", void 0)
], ReunioesController.prototype, "atualizarData", null);
exports.ReunioesController = ReunioesController = __decorate([
    (0, swagger_1.ApiTags)('Reuniões'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reunioes'),
    __metadata("design:paramtypes", [reunioes_service_1.ReunioesService])
], ReunioesController);
//# sourceMappingURL=reunioes.controller.js.map