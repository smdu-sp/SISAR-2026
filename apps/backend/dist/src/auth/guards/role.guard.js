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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissoes_service_1 = require("../../permissoes/permissoes.service");
const recursos_1 = require("../../permissoes/recursos");
const recurso_decorator_1 = require("../decorators/recurso.decorator");
let RoleGuard = class RoleGuard {
    constructor(reflector, permissoesService) {
        this.reflector = reflector;
        this.permissoesService = permissoesService;
    }
    async canActivate(context) {
        const usuario = context.switchToHttp().getRequest().user;
        if (!usuario)
            return true;
        const recursos = this.reflector.getAllAndOverride(recurso_decorator_1.RECURSOS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [recursos_1.RECURSO_PADRAO];
        if (recursos.includes(recurso_decorator_1.QUALQUER_LOGADO))
            return true;
        return this.permissoesService.temAlgum(usuario.permissao, recursos);
    }
};
exports.RoleGuard = RoleGuard;
exports.RoleGuard = RoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        permissoes_service_1.PermissoesService])
], RoleGuard);
//# sourceMappingURL=role.guard.js.map