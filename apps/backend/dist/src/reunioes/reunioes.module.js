"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReunioesModule = void 0;
const common_1 = require("@nestjs/common");
const reunioes_service_1 = require("./reunioes.service");
const reunioes_controller_1 = require("./reunioes.controller");
let ReunioesModule = class ReunioesModule {
};
exports.ReunioesModule = ReunioesModule;
exports.ReunioesModule = ReunioesModule = __decorate([
    (0, common_1.Module)({
        controllers: [reunioes_controller_1.ReunioesController],
        providers: [reunioes_service_1.ReunioesService],
    })
], ReunioesModule);
//# sourceMappingURL=reunioes.module.js.map