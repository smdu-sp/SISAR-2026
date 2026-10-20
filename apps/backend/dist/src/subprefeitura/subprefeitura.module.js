"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubprefeituraModule = void 0;
const common_1 = require("@nestjs/common");
const subprefeitura_service_1 = require("./subprefeitura.service");
const subprefeitura_controller_1 = require("./subprefeitura.controller");
let SubprefeituraModule = class SubprefeituraModule {
};
exports.SubprefeituraModule = SubprefeituraModule;
exports.SubprefeituraModule = SubprefeituraModule = __decorate([
    (0, common_1.Module)({
        controllers: [subprefeitura_controller_1.SubprefeituraController],
        providers: [subprefeitura_service_1.SubprefeituraService],
    })
], SubprefeituraModule);
//# sourceMappingURL=subprefeitura.module.js.map