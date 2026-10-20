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
exports.FinalizacaoController = void 0;
const common_1 = require("@nestjs/common");
const finalizacao_service_1 = require("./finalizacao.service");
const create_finalizacao_dto_1 = require("./dto/create-finalizacao.dto");
const update_finalizacao_dto_1 = require("./dto/update-finalizacao.dto");
const swagger_1 = require("@nestjs/swagger");
const finalizacao_response_dto_1 = require("./dto/finalizacao-response.dto");
let FinalizacaoController = class FinalizacaoController {
    constructor(finalizacaoService) {
        this.finalizacaoService = finalizacaoService;
    }
    create(createFinalizacaoDto) {
        return this.finalizacaoService.criar(createFinalizacaoDto);
    }
    findAll(pagina = '0', limite = '10', busca) {
        return this.finalizacaoService.buscarTudo(+pagina, +limite, busca);
    }
    findOne(id) {
        return this.finalizacaoService.buscaId(+id);
    }
    update(id, updateFinalizacaoDto) {
        return this.finalizacaoService.atualizar(+id, updateFinalizacaoDto);
    }
};
exports.FinalizacaoController = FinalizacaoController;
__decorate([
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para criação de finalização.', type: create_finalizacao_dto_1.CreateFinalizacaoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se criar a finalização com sucesso.', type: finalizacao_response_dto_1.FinalizacaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Criar uma finalização.", summary: 'Crie finalizações.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_finalizacao_dto_1.CreateFinalizacaoDto]),
    __metadata("design:returntype", void 0)
], FinalizacaoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar as finalizações com sucesso.', type: [finalizacao_response_dto_1.FinalizacaoResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todas as finalizações.", summary: 'Busque finalizações.' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinalizacaoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('buscar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar a finalização com sucesso.', type: finalizacao_response_dto_1.FinalizacaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar uma finalização.", summary: 'Busque uma finalização.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinalizacaoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar a finalização com sucesso.', type: finalizacao_response_dto_1.FinalizacaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar finalização.", summary: 'Atualize finalizações.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_finalizacao_dto_1.UpdateFinalizacaoDto]),
    __metadata("design:returntype", void 0)
], FinalizacaoController.prototype, "update", null);
exports.FinalizacaoController = FinalizacaoController = __decorate([
    (0, common_1.Controller)('finalizacao'),
    (0, swagger_1.ApiTags)('Finalização'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [finalizacao_service_1.FinalizacaoService])
], FinalizacaoController);
//# sourceMappingURL=finalizacao.controller.js.map