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
exports.CategoriaController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categoria_service_1 = require("./categoria.service");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const update_categoria_dto_1 = require("./dto/update-categoria.dto");
let CategoriaController = class CategoriaController {
    constructor(service) {
        this.service = service;
    }
    criar(dto) {
        return this.service.criar(dto);
    }
    buscarTudo(pagina, limite, busca) {
        return this.service.buscarTudo(+pagina, +limite, busca);
    }
    listaCompleta() {
        return this.service.listaCompleta();
    }
    buscarPorId(id) {
        return this.service.buscarPorId(id);
    }
    atualizar(id, dto) {
        return this.service.atualizar(id, dto);
    }
    remover(id) {
        return this.service.remover(id);
    }
};
exports.CategoriaController = CategoriaController;
__decorate([
    (0, recurso_decorator_1.Recurso)('categorias'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar categoria' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'Listar categorias paginado' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Lista completa de categorias' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "listaCompleta", null);
__decorate([
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar categoria por id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('categorias'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar categoria' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_dto_1.UpdateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('categorias'),
    (0, common_1.Delete)('remover/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover categoria' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaController.prototype, "remover", null);
exports.CategoriaController = CategoriaController = __decorate([
    (0, swagger_1.ApiTags)('Categorias'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [categoria_service_1.CategoriaService])
], CategoriaController);
//# sourceMappingURL=categoria.controller.js.map