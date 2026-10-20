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
exports.AdmissibilidadeController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const admissibilidade_service_1 = require("./admissibilidade.service");
const create_admissibilidade_dto_1 = require("./dto/create-admissibilidade.dto");
const update_admissibilidade_dto_1 = require("./dto/update-admissibilidade.dto");
const admitir_dto_1 = require("./dto/admitir.dto");
const swagger_1 = require("@nestjs/swagger");
const responses_dto_1 = require("./dto/responses.dto");
let AdmissibilidadeController = class AdmissibilidadeController {
    constructor(admissibilidadeService) {
        this.admissibilidadeService = admissibilidadeService;
    }
    create(createAdmissibilidadeDto) {
        return this.admissibilidadeService.create(createAdmissibilidadeDto);
    }
    findAll() {
        return this.admissibilidadeService.findAll();
    }
    buscarTudo(pagina = 1, limite = 10, filtro, busca) {
        return this.admissibilidadeService.buscarTudo(+pagina, +limite, +filtro, busca);
    }
    buscarPorId(id) {
        return this.admissibilidadeService.buscarPorId(+id);
    }
    listaCompleta() {
        return this.admissibilidadeService.listaCompleta();
    }
    atulaizarStatus(id, updateAdmissibilidadeDto) {
        return this.admissibilidadeService.atualizarStatus(+id, updateAdmissibilidadeDto);
    }
    admitir(inicialId, dto) {
        return this.admissibilidadeService.admitir(+inicialId, dto);
    }
    inadmitir(inicialId, dto) {
        return this.admissibilidadeService.inadmitir(+inicialId, dto);
    }
    remove(id) {
        return this.admissibilidadeService.remove(+id);
    }
    verificaReconsideracao() {
        return this.admissibilidadeService.verificaReconsideracao();
    }
    async contarRegistros() {
        return this.admissibilidadeService.contarForaDoPrazo();
    }
    async contarDentroPrazo() {
        return this.admissibilidadeService.contarDentroDoPrazo();
    }
    async admissibilidadeFinalizada() {
        return this.admissibilidadeService.admissibilidadeFinalizada();
    }
    async medianaAdmissibilidade() {
        return this.admissibilidadeService.medianaTempoAdmissibilidade();
    }
    async registrosAdmibilidade() {
        return this.admissibilidadeService.registrosAdmissibilidadeFinalizada();
    }
};
exports.AdmissibilidadeController = AdmissibilidadeController;
__decorate([
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_admissibilidade_dto_1.CreateAdmissibilidadeDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar a admissibilidade com sucesso.', type: responses_dto_1.CreateResponseAdmissibilidadeDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Registrar uma admissibilidade.", summary: 'Registre uma admissibilidade.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admissibilidade_dto_1.CreateAdmissibilidadeDto]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('consulta'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se consultar a admissibilidade com sucesso.', type: [responses_dto_1.AdmissibilidadeResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Consultar uma admissibilidade.", summary: 'Consulte uma admissibilidade.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as admissibilidades.", summary: 'Busque tudo admissibilidade.' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filtro', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar todas as admissibilidades com sucesso.', type: responses_dto_1.AdmissibilidadePaginado }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('filtro')),
    __param(3, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('buscar-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Buscar admissibilidade por ID.", summary: 'Busque a admissibilidade por ID.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a admissibilidade por ID com sucesso.', type: responses_dto_1.AdmissibilidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('admissibilidade_decidir'),
    (0, common_1.Get)('lista'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Listar todas as admissibilidades.", summary: 'Liste tudo admissibilidade.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se listar todas as admissibilidades com sucesso.', type: [responses_dto_1.AdmissibilidadeResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "listaCompleta", null);
__decorate([
    (0, common_1.Patch)('atualizar-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_admissibilidade_dto_1.UpdateAdmissibilidadeDto }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar admissibilidade.", summary: 'Atualize admissibilidade.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar a admissibilidade com sucesso.', type: responses_dto_1.AdmissibilidadeResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admissibilidade_dto_1.UpdateAdmissibilidadeDto]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "atulaizarStatus", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('admissibilidade_decidir'),
    (0, common_1.Post)('admitir/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'inicialId', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: admitir_dto_1.AdmitirDto }),
    (0, swagger_1.ApiOperation)({ description: 'Admitir processo (admissibilidade + envio à análise numa transação).', summary: 'Admitir processo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se admitir com sucesso.', type: responses_dto_1.AdmissibilidadeResponseDTO }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admitir_dto_1.AdmitirDto]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "admitir", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('admissibilidade_decidir'),
    (0, common_1.Post)('inadmitir/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'inicialId', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: admitir_dto_1.InadmitirDto }),
    (0, swagger_1.ApiOperation)({ description: 'Inadmitir processo (abre janela de reconsideração).', summary: 'Inadmitir processo.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se inadmitir com sucesso.', type: responses_dto_1.AdmissibilidadeResponseDTO }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admitir_dto_1.InadmitirDto]),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "inadmitir", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Deletar a admissibilidade.", summary: 'Delete admissibilidade.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se deletar a admissibilidade com sucesso.', type: String }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], AdmissibilidadeController.prototype, "remove", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('admissibilidade_decidir'),
    (0, common_1.Get)('verifica-reconsideracao'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdmissibilidadeController.prototype, "verificaReconsideracao", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('dashboard_admissibilidade'),
    (0, common_1.Get)('contar-fora-prazo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "contarRegistros", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('dashboard_admissibilidade'),
    (0, common_1.Get)('contar-dentro-prazo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "contarDentroPrazo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('dashboard_admissibilidade'),
    (0, common_1.Get)('admissibilidade-finalizada'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "admissibilidadeFinalizada", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('dashboard_admissibilidade'),
    (0, common_1.Get)('mediana-admissibilidade'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "medianaAdmissibilidade", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('dashboard_admissibilidade'),
    (0, common_1.Get)('registros-admissibilidade'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeController.prototype, "registrosAdmibilidade", null);
exports.AdmissibilidadeController = AdmissibilidadeController = __decorate([
    (0, swagger_1.ApiTags)('Admissibilidade'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admissibilidade'),
    __metadata("design:paramtypes", [admissibilidade_service_1.AdmissibilidadeService])
], AdmissibilidadeController);
//# sourceMappingURL=admissibilidade.controller.js.map