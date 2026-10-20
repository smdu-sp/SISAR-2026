"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissibilidadeModule = void 0;
const common_1 = require("@nestjs/common");
const admissibilidade_service_1 = require("./admissibilidade.service");
const admissibilidade_controller_1 = require("./admissibilidade.controller");
const schedule_1 = require("@nestjs/schedule");
let AdmissibilidadeModule = class AdmissibilidadeModule {
};
exports.AdmissibilidadeModule = AdmissibilidadeModule;
exports.AdmissibilidadeModule = AdmissibilidadeModule = __decorate([
    (0, common_1.Module)({
        controllers: [admissibilidade_controller_1.AdmissibilidadeController],
        providers: [admissibilidade_service_1.AdmissibilidadeService],
        imports: [
            schedule_1.ScheduleModule.forRoot()
        ],
    })
], AdmissibilidadeModule);
//# sourceMappingURL=admissibilidade.module.js.map