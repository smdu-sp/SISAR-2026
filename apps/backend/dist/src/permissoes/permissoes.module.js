"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissoesModule = void 0;
const common_1 = require("@nestjs/common");
const permissoes_controller_1 = require("./permissoes.controller");
const permissoes_service_1 = require("./permissoes.service");
let PermissoesModule = class PermissoesModule {
};
exports.PermissoesModule = PermissoesModule;
exports.PermissoesModule = PermissoesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [permissoes_controller_1.PermissoesController],
        providers: [permissoes_service_1.PermissoesService],
        exports: [permissoes_service_1.PermissoesService],
    })
], PermissoesModule);
//# sourceMappingURL=permissoes.module.js.map