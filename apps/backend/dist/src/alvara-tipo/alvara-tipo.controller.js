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
exports.AlvaraTipoController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const alvara_tipo_service_1 = require("./alvara-tipo.service");
const create_alvara_tipo_dto_1 = require("./dto/create-alvara-tipo.dto");
const update_alvara_tipo_dto_1 = require("./dto/update-alvara-tipo.dto");
const swagger_1 = require("@nestjs/swagger");
const alvara_tipo_responses_dto_1 = require("./dto/alvara-tipo-responses.dto");
let AlvaraTipoController = class AlvaraTipoController {
    constructor(alvaraTipoService) {
        this.alvaraTipoService = alvaraTipoService;
    }
    criar(createAlvaraTipoDto) {
        return this.alvaraTipoService.criar(createAlvaraTipoDto);
    }
    listaCompleta() {
        return this.alvaraTipoService.listaCompleta();
    }
    buscarTudo(pagina, limite, busca) {
        return this.alvaraTipoService.buscarTudo(+pagina, +limite, busca);
    }
    buscarPorId(id) {
        return this.alvaraTipoService.buscarPorId(id);
    }
    atualizar(id, updateAlvaraTipoDto) {
        return this.alvaraTipoService.atualizar(id, updateAlvaraTipoDto);
    }
    auterarStatus(id, updateAlvaraTipoDto) {
        return this.alvaraTipoService.atualizar(id, updateAlvaraTipoDto);
    }
};
exports.AlvaraTipoController = AlvaraTipoController;
__decorate([
    (0, recurso_decorator_1.Recurso)('alvaras'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_alvara_tipo_dto_1.CreateAlvaraTipoDto }),
    (0, swagger_1.ApiOperation)({ description: "Registrar um alvará-tipo.", summary: 'Registre um alvará-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar o alvará-tipo com sucesso.', type: alvara_tipo_responses_dto_1.AlvaraTipoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_alvara_tipo_dto_1.CreateAlvaraTipoDto]),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Listar os alvaras-tipo.", summary: 'Liste os alvarás-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se listar a lista completa dos alvaras-tipo com sucesso.', type: [alvara_tipo_responses_dto_1.AlvaraTipoResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "listaCompleta", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('alvaras'),
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiOperation)({ description: "Buscar os alvarás-tipo.", summary: 'Busque os alvarás-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar os alvaras-tipo com sucesso.', type: alvara_tipo_responses_dto_1.AlvaraTipoPaginadoDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "buscarTudo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('alvaras'),
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar um alvará-tipo.", summary: 'Busque um alvará-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar um alvará-tipo com sucesso.', type: alvara_tipo_responses_dto_1.AlvaraTipoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('alvaras'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_alvara_tipo_dto_1.UpdateAlvaraTipoDto }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar um alvará-tipo.", summary: 'Altualize um alvará-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar um alvará-tipo com sucesso.', type: alvara_tipo_responses_dto_1.AlvaraTipoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_alvara_tipo_dto_1.UpdateAlvaraTipoDto]),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('alvaras'),
    (0, common_1.Patch)('auterar-status/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_alvara_tipo_dto_1.UpdateAlvaraTipoDto }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar status do alvará-tipo.", summary: 'Atualize status do alvará-tipo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar o status do alvará-tipo com sucesso.', type: alvara_tipo_responses_dto_1.AlvaraTipoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_alvara_tipo_dto_1.UpdateAlvaraTipoDto]),
    __metadata("design:returntype", Promise)
], AlvaraTipoController.prototype, "auterarStatus", null);
exports.AlvaraTipoController = AlvaraTipoController = __decorate([
    (0, swagger_1.ApiTags)('Alvará-Tipo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('alvara-tipo'),
    __metadata("design:paramtypes", [alvara_tipo_service_1.AlvaraTipoService])
], AlvaraTipoController);
//# sourceMappingURL=alvara-tipo.controller.js.map