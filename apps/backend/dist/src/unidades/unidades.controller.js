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
exports.UnidadesController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const unidades_service_1 = require("./unidades.service");
const create_unidade_dto_1 = require("./dto/create-unidade.dto");
const update_unidade_dto_1 = require("./dto/update-unidade.dto");
const swagger_1 = require("@nestjs/swagger");
const unidade_response_dto_1 = require("./dto/unidade-response.dto");
const client_1 = require("@prisma/client");
let UnidadesController = class UnidadesController {
    constructor(unidadesService) {
        this.unidadesService = unidadesService;
    }
    criar(createUnidadeDto) {
        return this.unidadesService.criar(createUnidadeDto);
    }
    buscarTudo(pagina, limite, busca, filtro, nivel) {
        return this.unidadesService.buscarTudo(+pagina, +limite, busca, +filtro, nivel);
    }
    arvore(busca) {
        return this.unidadesService.arvore(busca);
    }
    listaCompleta(nivel) {
        return this.unidadesService.listaCompleta(nivel);
    }
    buscarPorId(id) {
        return this.unidadesService.buscarPorId(id);
    }
    atualizar(id, updateUnidadeDto) {
        return this.unidadesService.atualizar(id, updateUnidadeDto);
    }
    desativar(id) {
        return this.unidadesService.desativar(id);
    }
};
exports.UnidadesController = UnidadesController;
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para criação de unidade.', type: create_unidade_dto_1.CreateUnidadeDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se criar com sucesso.', type: unidade_response_dto_1.UnidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Crie uma unidade.", summary: 'Crie unidades.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unidade_dto_1.CreateUnidadeDto]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "criar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades', 'relatorios'),
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar com sucesso.', type: [create_unidade_dto_1.CreateUnidadeDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Busque todas as unidades.", summary: 'Busque todas as unidades.' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filtro', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'nivel', enum: client_1.Nivel_Unidade, required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __param(3, (0, common_1.Query)('filtro')),
    __param(4, (0, common_1.Query)('nivel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], UnidadesController.prototype, "buscarTudo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Get)('arvore'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna a árvore hierárquica de unidades.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Árvore hierárquica de unidades.", summary: 'Árvore de unidades.' }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    __param(0, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnidadesController.prototype, "arvore", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se listar tudo com sucesso.', type: [unidade_response_dto_1.UnidadeResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Listar todas as unidades.", summary: 'Liste todas as unidades.' }),
    (0, swagger_1.ApiQuery)({ name: 'nivel', enum: client_1.Nivel_Unidade, required: false }),
    __param(0, (0, common_1.Query)('nivel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "listaCompleta", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar por ID com sucesso.', type: unidade_response_dto_1.UnidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar uma unidade.", summary: 'Busque uma unidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de unidade.', type: create_unidade_dto_1.CreateUnidadeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar com sucesso.', type: unidade_response_dto_1.UnidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar uma unidade.", summary: 'Atualize uma unidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unidade_dto_1.UpdateUnidadeDto]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('unidades'),
    (0, common_1.Patch)('desativar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para desativação de unidade.', type: create_unidade_dto_1.CreateUnidadeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se desativar com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Desativar uma unidade.", summary: 'Desative uma unidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnidadesController.prototype, "desativar", null);
exports.UnidadesController = UnidadesController = __decorate([
    (0, swagger_1.ApiTags)('Unidades'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('unidades'),
    __metadata("design:paramtypes", [unidades_service_1.UnidadesService])
], UnidadesController);
//# sourceMappingURL=unidades.controller.js.map