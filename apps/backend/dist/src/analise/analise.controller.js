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
exports.AnaliseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analise_service_1 = require("./analise.service");
const registrar_pre_reuniao_dto_1 = require("./dto/registrar-pre-reuniao.dto");
const registrar_comunique_se_dto_1 = require("./dto/registrar-comunique-se.dto");
const registrar_decisao_dto_1 = require("./dto/registrar-decisao.dto");
const resposta_comunique_se_dto_1 = require("./dto/resposta-comunique-se.dto");
let AnaliseController = class AnaliseController {
    constructor(analiseService) {
        this.analiseService = analiseService;
    }
    obterContexto(inicialId) {
        return this.analiseService.obterContexto(+inicialId);
    }
    registrarPreReuniao(inicialId, dto) {
        return this.analiseService.registrarPreReuniao(+inicialId, dto);
    }
    registrarComuniqueSe(inicialId, dto) {
        return this.analiseService.registrarComuniqueSe(+inicialId, dto);
    }
    registrarRespostaComuniqueSe(id, dto) {
        return this.analiseService.registrarRespostaComuniqueSe(id, dto.data_resposta);
    }
    registrarDecisao(inicialId, dto) {
        return this.analiseService.registrarDecisao(+inicialId, dto);
    }
    registrarRecurso(inicialId) {
        return this.analiseService.registrarRecurso(+inicialId);
    }
    encerrarSemRecurso(inicialId) {
        return this.analiseService.encerrarSemRecurso(+inicialId);
    }
};
exports.AnaliseController = AnaliseController;
__decorate([
    (0, common_1.Get)('contexto/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Estado do fluxo de análise técnica' }),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "obterContexto", null);
__decorate([
    (0, common_1.Post)('pre-reuniao/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: registrar_pre_reuniao_dto_1.RegistrarPreReuniaoDto }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, registrar_pre_reuniao_dto_1.RegistrarPreReuniaoDto]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "registrarPreReuniao", null);
__decorate([
    (0, common_1.Post)('comunique-se/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: registrar_comunique_se_dto_1.RegistrarComuniqueSeDto }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, registrar_comunique_se_dto_1.RegistrarComuniqueSeDto]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "registrarComuniqueSe", null);
__decorate([
    (0, common_1.Patch)('comunique-se/:id/resposta'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ type: resposta_comunique_se_dto_1.RespostaComuniqueSeDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resposta_comunique_se_dto_1.RespostaComuniqueSeDto]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "registrarRespostaComuniqueSe", null);
__decorate([
    (0, common_1.Post)('decisao/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ type: registrar_decisao_dto_1.RegistrarDecisaoDto }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, registrar_decisao_dto_1.RegistrarDecisaoDto]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "registrarDecisao", null);
__decorate([
    (0, common_1.Post)('recurso/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "registrarRecurso", null);
__decorate([
    (0, common_1.Post)('encerrar-recurso/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnaliseController.prototype, "encerrarSemRecurso", null);
exports.AnaliseController = AnaliseController = __decorate([
    (0, swagger_1.ApiTags)('Análise'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('analise'),
    __metadata("design:paramtypes", [analise_service_1.AnaliseService])
], AnaliseController);
//# sourceMappingURL=analise.controller.js.map