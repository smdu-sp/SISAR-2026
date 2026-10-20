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
exports.InicialController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const inicial_service_1 = require("./inicial.service");
const create_inicial_dto_1 = require("./dto/create-inicial.dto");
const update_inicial_dto_1 = require("./dto/update-inicial.dto");
const importar_inicial_dto_1 = require("./dto/importar-inicial.dto");
const swagger_1 = require("@nestjs/swagger");
const inicial_response_dto_1 = require("./dto/inicial-response.dto");
let InicialController = class InicialController {
    constructor(inicialService) {
        this.inicialService = inicialService;
    }
    criar(createInicialDto) {
        return this.inicialService.criar(createInicialDto);
    }
    importar(arquivo) {
        if (!arquivo)
            throw new common_1.ForbiddenException('Nenhum arquivo enviado.');
        return this.inicialService.importarPlanilha(arquivo.buffer);
    }
    buscarTudo(pagina, limite, busca, status) {
        return this.inicialService.buscarTudo(+pagina, +limite, busca, +status);
    }
    buscarTudoEmAnalise(pagina, limite) {
        return this.inicialService.buscarTudoEmAnalise(+pagina, +limite);
    }
    buscarPorMesAnoProcesso(mes, ano) {
        return this.inicialService.buscarPorMesAnoProcesso(parseInt(mes), parseInt(ano));
    }
    buscarPorId(id) {
        return this.inicialService.buscarPorId(+id);
    }
    buscarPorDataProcesso(data) {
        return this.inicialService.buscarPorDataProcesso(data);
    }
    atualizar(id, updateInicialDto) {
        return this.inicialService.atualizar(+id, updateInicialDto);
    }
    adicionaSql(inicial_id, { sql }) {
        return this.inicialService.adicionaSql(+inicial_id, sql);
    }
    removeSql(inicial_id, sql) {
        return this.inicialService.removeSql(+inicial_id, sql);
    }
    validaSql(sql) {
        return this.inicialService.validaSql(sql);
    }
    verificaSei(sei) {
        return this.inicialService.verificaSei(sei);
    }
    todosProcessos() {
        return this.inicialService.todosProcessos();
    }
};
exports.InicialController = InicialController;
__decorate([
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_inicial_dto_1.CreateInicialDto }),
    (0, swagger_1.ApiOperation)({ description: "Registrar uma inicial.", summary: 'Registre uma inicial.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar a inicial com sucesso.', type: inicial_response_dto_1.InicialResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inicial_dto_1.CreateInicialDto]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "criar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('importar'),
    (0, common_1.Post)('importar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('arquivo')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { arquivo: { type: 'string', format: 'binary' } },
        },
    }),
    (0, swagger_1.ApiOperation)({ description: 'Importar processos em massa a partir de uma planilha .xlsx.', summary: 'Importe processos por planilha.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna o resumo da importação.', type: importar_inicial_dto_1.ImportarInicialResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "importar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('painel_inicial', 'processos'),
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as iniciais.", summary: 'Busque todas as iniciais.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar as iniciais com sucesso.', type: inicial_response_dto_1.IniciaisPaginado }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "buscarTudo", null);
__decorate([
    (0, common_1.Get)('buscar-tudo-analise'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as iniciais.", summary: 'Busque todas as iniciais.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar as iniciais com sucesso.', type: inicial_response_dto_1.IniciaisPaginado }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "buscarTudoEmAnalise", null);
__decorate([
    (0, common_1.Get)('buscar/:mes/:ano'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'mes', type: 'string', required: true }),
    (0, swagger_1.ApiParam)({ name: 'ano', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas por mês e ano.", summary: 'Busque todas por mês e ano.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar as iniciais com sucesso.', type: [inicial_response_dto_1.InicialProcessosMesAnoResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('ano')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "buscarPorMesAnoProcesso", null);
__decorate([
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar por ID.", summary: 'Busque por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a inicial por ID com sucesso.', type: inicial_response_dto_1.InicialResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "buscarPorId", null);
__decorate([
    (0, common_1.Get)('buscar-data-processo/:date'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'date', type: 'Date', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar por data.", summary: 'Busque por data.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a inicial por ID com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", void 0)
], InicialController.prototype, "buscarPorDataProcesso", null);
__decorate([
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_inicial_dto_1.UpdateInicialDto }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar por ID.", summary: 'Atualize por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar a inicial por ID com sucesso.', type: inicial_response_dto_1.InicialResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inicial_dto_1.UpdateInicialDto]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Patch)('adiciona-sql/:inicial_id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'inicial_id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Adicionar sql por ID.", summary: 'Adicione sql por ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se adicionar sql à inicial por ID com sucesso.', type: inicial_response_dto_1.SqlResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('inicial_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "adicionaSql", null);
__decorate([
    (0, common_1.Delete)('remove-sql/:inicial_id/:sql'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'inicial_id', type: 'string', required: true }),
    (0, swagger_1.ApiParam)({ name: 'sql', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Deletar sql por ID da inicial.", summary: 'Delete sql por ID da inicial.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se deletar sql por ID da inicial com sucesso.', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('inicial_id')),
    __param(1, (0, common_1.Param)('sql')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "removeSql", null);
__decorate([
    (0, common_1.Get)('valida-sql/:sql'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'sql', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Validar sql.", summary: 'Valide sql.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se validar sql com sucesso.', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('sql')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InicialController.prototype, "validaSql", null);
__decorate([
    (0, common_1.Get)('verifica-sei/:sei'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'sei', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Verificar sei.", summary: 'Verifique o sei.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se verificar o sei com sucesso.', type: inicial_response_dto_1.InicialResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('sei')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "verificaSei", null);
__decorate([
    (0, common_1.Get)('busca-processos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Buscar processos.", summary: 'Busque processos.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 ao buscar processos com sucesso.', type: [inicial_response_dto_1.InicialProcessosResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InicialController.prototype, "todosProcessos", null);
exports.InicialController = InicialController = __decorate([
    (0, swagger_1.ApiTags)('Inicial'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('inicial'),
    __metadata("design:paramtypes", [inicial_service_1.InicialService])
], InicialController);
//# sourceMappingURL=inicial.controller.js.map