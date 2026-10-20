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
exports.MotivoInadmissaoController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_motivo_inadmissao_dto_1 = require("./dto/create-motivo-inadmissao.dto");
const update_motivo_inadmissao_dto_1 = require("./dto/update-motivo-inadmissao.dto");
const motivo_inadmissao_service_1 = require("./motivo-inadmissao.service");
let MotivoInadmissaoController = class MotivoInadmissaoController {
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
exports.MotivoInadmissaoController = MotivoInadmissaoController;
__decorate([
    (0, recurso_decorator_1.Recurso)('motivos_inadmissao'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar motivo de inadmissão' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_motivo_inadmissao_dto_1.CreateMotivoInadmissaoDto]),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "listaCompleta", null);
__decorate([
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('motivos_inadmissao'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_motivo_inadmissao_dto_1.UpdateMotivoInadmissaoDto]),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('motivos_inadmissao'),
    (0, common_1.Delete)('remover/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MotivoInadmissaoController.prototype, "remover", null);
exports.MotivoInadmissaoController = MotivoInadmissaoController = __decorate([
    (0, swagger_1.ApiTags)('Motivos de Inadmissão'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('motivos-inadmissao'),
    __metadata("design:paramtypes", [motivo_inadmissao_service_1.MotivoInadmissaoService])
], MotivoInadmissaoController);
//# sourceMappingURL=motivo-inadmissao.controller.js.map