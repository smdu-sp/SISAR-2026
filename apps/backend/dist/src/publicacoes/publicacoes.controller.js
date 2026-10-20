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
exports.PublicacoesController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const publicacoes_service_1 = require("./publicacoes.service");
const create_publicacao_dto_1 = require("./dto/create-publicacao.dto");
const update_publicacao_dto_1 = require("./dto/update-publicacao.dto");
let PublicacoesController = class PublicacoesController {
    constructor(service) {
        this.service = service;
    }
    criar(dto) {
        return this.service.criar(dto);
    }
    buscarTudo(pagina, limite, busca, tipo_documento, colegiado) {
        return this.service.buscarTudo(+pagina, +limite, busca, tipo_documento, colegiado);
    }
    buscarPorId(id) {
        return this.service.buscarPorId(id);
    }
    atualizar(id, dto) {
        return this.service.atualizar(id, dto);
    }
};
exports.PublicacoesController = PublicacoesController;
__decorate([
    (0, recurso_decorator_1.Recurso)('publicacoes'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar publicação' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publicacao_dto_1.CreatePublicacaoDto]),
    __metadata("design:returntype", void 0)
], PublicacoesController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tipo_documento', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'colegiado', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __param(3, (0, common_1.Query)('tipo_documento')),
    __param(4, (0, common_1.Query)('colegiado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PublicacoesController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicacoesController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('publicacoes'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publicacao_dto_1.UpdatePublicacaoDto]),
    __metadata("design:returntype", void 0)
], PublicacoesController.prototype, "atualizar", null);
exports.PublicacoesController = PublicacoesController = __decorate([
    (0, swagger_1.ApiTags)('Publicações'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('publicacoes'),
    __metadata("design:paramtypes", [publicacoes_service_1.PublicacoesService])
], PublicacoesController);
//# sourceMappingURL=publicacoes.controller.js.map