"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlvaraTipoModule = void 0;
const common_1 = require("@nestjs/common");
const alvara_tipo_service_1 = require("./alvara-tipo.service");
const alvara_tipo_controller_1 = require("./alvara-tipo.controller");
let AlvaraTipoModule = class AlvaraTipoModule {
};
exports.AlvaraTipoModule = AlvaraTipoModule;
exports.AlvaraTipoModule = AlvaraTipoModule = __decorate([
    (0, common_1.Module)({
        controllers: [alvara_tipo_controller_1.AlvaraTipoController],
        providers: [alvara_tipo_service_1.AlvaraTipoService],
    })
], AlvaraTipoModule);
//# sourceMappingURL=alvara-tipo.module.js.map