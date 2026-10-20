"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotivoInadmissaoModule = void 0;
const common_1 = require("@nestjs/common");
const motivo_inadmissao_controller_1 = require("./motivo-inadmissao.controller");
const motivo_inadmissao_service_1 = require("./motivo-inadmissao.service");
let MotivoInadmissaoModule = class MotivoInadmissaoModule {
};
exports.MotivoInadmissaoModule = MotivoInadmissaoModule;
exports.MotivoInadmissaoModule = MotivoInadmissaoModule = __decorate([
    (0, common_1.Module)({
        controllers: [motivo_inadmissao_controller_1.MotivoInadmissaoController],
        providers: [motivo_inadmissao_service_1.MotivoInadmissaoService],
        exports: [motivo_inadmissao_service_1.MotivoInadmissaoService],
    })
], MotivoInadmissaoModule);
//# sourceMappingURL=motivo-inadmissao.module.js.map