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
exports.ParecerAdmissibilidadeController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const parecer_admissibilidade_service_1 = require("./parecer_admissibilidade.service");
const create_parecer_admissibilidade_dto_1 = require("./dto/create-parecer_admissibilidade.dto");
const update_parecer_admissibilidade_dto_1 = require("./dto/update-parecer_admissibilidade.dto");
const swagger_1 = require("@nestjs/swagger");
const parecer_admissibilidade_resopnse_dto_1 = require("./dto/parecer_admissibilidade-resopnse.dto");
let ParecerAdmissibilidadeController = class ParecerAdmissibilidadeController {
    constructor(parecerAdmissibilidadeService) {
        this.parecerAdmissibilidadeService = parecerAdmissibilidadeService;
    }
    create(createParecerAdmissibilidadeDto) {
        return this.parecerAdmissibilidadeService.criar(createParecerAdmissibilidadeDto);
    }
    buscarTudo(pagina, limite, busca) {
        return this.parecerAdmissibilidadeService.buscarTudo(+pagina, +limite, busca);
    }
    buscarPorId(id) {
        return this.parecerAdmissibilidadeService.buscarPorId(id);
    }
    atualizar(id, updateParecerAdmissibilidadeDto) {
        return this.parecerAdmissibilidadeService.atualizar(id, updateParecerAdmissibilidadeDto);
    }
    desativar(id) {
        return this.parecerAdmissibilidadeService.desativar(id);
    }
};
exports.ParecerAdmissibilidadeController = ParecerAdmissibilidadeController;
__decorate([
    (0, recurso_decorator_1.Recurso)('pareceres'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_parecer_admissibilidade_dto_1.CreateParecerAdmissibilidadeDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar um parecer-admissibilidade com sucesso.', type: parecer_admissibilidade_resopnse_dto_1.ParecerAdmissibilidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Registrar um parecer-admissibilidade.", summary: 'Registre um parecer-admissibilidade.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_parecer_admissibilidade_dto_1.CreateParecerAdmissibilidadeDto]),
    __metadata("design:returntype", Promise)
], ParecerAdmissibilidadeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limite', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'busca', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar parecer-admissibilidade com sucesso.', type: parecer_admissibilidade_resopnse_dto_1.ParecerAdmissibilidadePaginadoDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todos os parecer-admissibilidade.", summary: 'Busque parecer-admissibilidade.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ParecerAdmissibilidadeController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar um parecer-admissibilidade por ID com sucesso.', type: parecer_admissibilidade_resopnse_dto_1.ParecerAdmissibilidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar um parecer-admissibilidade.", summary: 'Busque um parecer-admissibilidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParecerAdmissibilidadeController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('pareceres'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar parecer-admissibilidade com sucesso.', type: parecer_admissibilidade_resopnse_dto_1.ParecerAdmissibilidadePaginadoDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar um parecer-admissibilidade.", summary: 'Atualize parecer-admissibilidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_parecer_admissibilidade_dto_1.UpdateParecerAdmissibilidadeDto]),
    __metadata("design:returntype", Promise)
], ParecerAdmissibilidadeController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('pareceres'),
    (0, common_1.Delete)('desativar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se deletar parecer-admissibilidade com sucesso.', type: parecer_admissibilidade_resopnse_dto_1.ParecerAdmissibilidadePaginadoDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Deletar um parecer-admissibilidade.", summary: 'Delete parecer-admissibilidade.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ParecerAdmissibilidadeController.prototype, "desativar", null);
exports.ParecerAdmissibilidadeController = ParecerAdmissibilidadeController = __decorate([
    (0, swagger_1.ApiTags)('Parecer-Admissibilidade'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('parecer-admissibilidade'),
    __metadata("design:paramtypes", [parecer_admissibilidade_service_1.ParecerAdmissibilidadeService])
], ParecerAdmissibilidadeController);
//# sourceMappingURL=parecer_admissibilidade.controller.js.map