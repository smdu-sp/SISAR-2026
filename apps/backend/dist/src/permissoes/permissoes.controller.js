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
exports.PermissoesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const usuario_atual_decorator_1 = require("../auth/decorators/usuario-atual.decorator");
const definir_permissoes_dto_1 = require("./dto/definir-permissoes.dto");
const permissoes_service_1 = require("./permissoes.service");
const recursos_1 = require("./recursos");
let PermissoesController = class PermissoesController {
    constructor(service) {
        this.service = service;
    }
    async meusRecursos(usuario) {
        return { recursos: await this.service.recursosDoPerfil(usuario.permissao) };
    }
    matriz() {
        return this.service.matriz();
    }
    definir(perfil, dto) {
        return this.service.definir(perfil, dto.recursos);
    }
    restaurarPadrao() {
        return this.service.restaurarPadrao();
    }
};
exports.PermissoesController = PermissoesController;
__decorate([
    (0, common_1.Get)('meus-recursos'),
    (0, recurso_decorator_1.AcessoLogado)(),
    (0, swagger_1.ApiOperation)({ summary: 'Recursos que o perfil do usuário logado pode acessar.' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissoesController.prototype, "meusRecursos", null);
__decorate([
    (0, common_1.Get)(),
    (0, recurso_decorator_1.Recurso)(recursos_1.RECURSO_TRAVADO),
    (0, swagger_1.ApiOperation)({ summary: 'Catálogo de recursos e matriz perfil x recurso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissoesController.prototype, "matriz", null);
__decorate([
    (0, common_1.Put)(':perfil'),
    (0, recurso_decorator_1.Recurso)(recursos_1.RECURSO_TRAVADO),
    (0, swagger_1.ApiOperation)({ summary: 'Define os recursos de um perfil.' }),
    __param(0, (0, common_1.Param)('perfil', new common_1.ParseEnumPipe(client_1.Permissao))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, definir_permissoes_dto_1.DefinirPermissoesDto]),
    __metadata("design:returntype", void 0)
], PermissoesController.prototype, "definir", null);
__decorate([
    (0, common_1.Post)('restaurar-padrao'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, recurso_decorator_1.Recurso)(recursos_1.RECURSO_TRAVADO),
    (0, swagger_1.ApiOperation)({ summary: 'Restaura o padrão de todos os perfis.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissoesController.prototype, "restaurarPadrao", null);
exports.PermissoesController = PermissoesController = __decorate([
    (0, swagger_1.ApiTags)('Permissões'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, common_1.Controller)('permissoes'),
    __metadata("design:paramtypes", [permissoes_service_1.PermissoesService])
], PermissoesController);
//# sourceMappingURL=permissoes.controller.js.map