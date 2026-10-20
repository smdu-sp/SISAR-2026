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
exports.AuthController = void 0;
const recurso_decorator_1 = require("./decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const is_public_decorator_1 = require("./decorators/is-public.decorator");
const usuario_atual_decorator_1 = require("./decorators/usuario-atual.decorator");
const refresh_guard_1 = require("./guards/refresh.guard");
const swagger_1 = require("@nestjs/swagger");
const UsuarioToken_1 = require("./models/UsuarioToken");
const login_dto_1 = require("./models/login.dto");
const eu_response_dto_1 = require("./models/eu-response.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(req) {
        return this.authService.login(req.user);
    }
    refresh(usuario) {
        return this.authService.refresh(usuario);
    }
    usuarioAtual(usuario) {
        return usuario;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Senha e login para autenticação por JWT.', type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se tiver sucesso no login.', type: UsuarioToken_1.UsuarioToken }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Logue na aplicação.", summary: 'Faça o login na aplicação.' }),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, is_public_decorator_1.IsPublic)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se o token for atualizado.', type: UsuarioToken_1.UsuarioToken }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Faça o refresh de seu token.", summary: 'Faça refresh do token.' }),
    (0, is_public_decorator_1.IsPublic)(),
    (0, common_1.UseGuards)(refresh_guard_1.RefreshAuthGuard),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, recurso_decorator_1.AcessoLogado)(),
    (0, common_1.Get)('eu'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se o sistema encontrar o usuário logado.', type: eu_response_dto_1.EuResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Busque o usuário logado.", summary: 'Busque o usuário logado' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "usuarioAtual", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map