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
exports.SubprefeituraController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const subprefeitura_service_1 = require("./subprefeitura.service");
const create_subprefeitura_dto_1 = require("./dto/create-subprefeitura.dto");
const update_subprefeitura_dto_1 = require("./dto/update-subprefeitura.dto");
const swagger_1 = require("@nestjs/swagger");
const subprefeitura_response_dto_1 = require("./dto/subprefeitura-response.dto");
let SubprefeituraController = class SubprefeituraController {
    constructor(subprefeiturasServiceimport) {
        this.subprefeiturasServiceimport = subprefeiturasServiceimport;
    }
    criar(CreateSubprefeituraDto) {
        return this.subprefeiturasServiceimport.criar(CreateSubprefeituraDto);
    }
    buscarTudo(pagina, limite, busca) {
        return this.subprefeiturasServiceimport.buscarTudo(+pagina, +limite, busca);
    }
    listaCompleta() {
        return this.subprefeiturasServiceimport.listaCompleta();
    }
    buscarPorId(id) {
        return this.subprefeiturasServiceimport.buscarPorId(id);
    }
    atualizar(id, updateUnidadeDto) {
        return this.subprefeiturasServiceimport.atualizar(id, updateUnidadeDto);
    }
};
exports.SubprefeituraController = SubprefeituraController;
__decorate([
    (0, recurso_decorator_1.Recurso)('subprefeituras'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_subprefeitura_dto_1.CreateSubprefeituraDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar a subprefeitura com sucesso.', type: subprefeitura_response_dto_1.CreateResponseSubprefeituraDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Registrar uma subprefeitura.", summary: 'Registre uma subprefeitura.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subprefeitura_dto_1.CreateSubprefeituraDto]),
    __metadata("design:returntype", Promise)
], SubprefeituraController.prototype, "criar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('subprefeituras'),
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar as subprefeituras com sucesso.', type: subprefeitura_response_dto_1.SubprefeituraPaginatedResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as subprefeituras.", summary: 'Busque as subprefeituras.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SubprefeituraController.prototype, "buscarTudo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('subprefeituras'),
    (0, common_1.Get)('lista-completa'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a lista completa com sucesso.', type: [subprefeitura_response_dto_1.SubprefeituraResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Lista completa de todas as subprefeituras.", summary: 'Liste as subprefeituras.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubprefeituraController.prototype, "listaCompleta", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('subprefeituras'),
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a subprefeitura por ID com sucesso.', type: subprefeitura_response_dto_1.SubprefeituraResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar uma subprefeitura.", summary: 'Busque uma subprefeitura.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubprefeituraController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('subprefeituras'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_subprefeitura_dto_1.UpdateSubprefeituraDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar a subprefeitura com sucesso.', type: subprefeitura_response_dto_1.SubprefeituraResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar subprefeitura.", summary: 'Atualize a subprefeitura.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subprefeitura_dto_1.UpdateSubprefeituraDto]),
    __metadata("design:returntype", Promise)
], SubprefeituraController.prototype, "atualizar", null);
exports.SubprefeituraController = SubprefeituraController = __decorate([
    (0, swagger_1.ApiTags)('Subprefeitura'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('subprefeitura'),
    __metadata("design:paramtypes", [subprefeitura_service_1.SubprefeituraService])
], SubprefeituraController);
//# sourceMappingURL=subprefeitura.controller.js.map