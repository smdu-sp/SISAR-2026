"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InicialModule = void 0;
const common_1 = require("@nestjs/common");
const inicial_service_1 = require("./inicial.service");
const inicial_controller_1 = require("./inicial.controller");
let InicialModule = class InicialModule {
};
exports.InicialModule = InicialModule;
exports.InicialModule = InicialModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [inicial_controller_1.InicialController],
        providers: [inicial_service_1.InicialService],
        exports: [inicial_service_1.InicialService],
    })
], InicialModule);
//# sourceMappingURL=inicial.module.js.map