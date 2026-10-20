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
exports.DistribuicaoController = exports.UpdateTecnicoResponsavelDTO = exports.UpdateAdministrativoResponsavelDTO = void 0;
const common_1 = require("@nestjs/common");
const distribuicao_service_1 = require("./distribuicao.service");
const create_distribuicao_dto_1 = require("./dto/create-distribuicao.dto");
const update_distribuicao_dto_1 = require("./dto/update-distribuicao.dto");
const swagger_1 = require("@nestjs/swagger");
const distribuicao_response_dto_1 = require("./dto/distribuicao-response.dto");
class UpdateAdministrativoResponsavelDTO {
}
exports.UpdateAdministrativoResponsavelDTO = UpdateAdministrativoResponsavelDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAdministrativoResponsavelDTO.prototype, "administrativo_responsavel_id", void 0);
class UpdateTecnicoResponsavelDTO {
}
exports.UpdateTecnicoResponsavelDTO = UpdateTecnicoResponsavelDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateTecnicoResponsavelDTO.prototype, "tecnico_responsavel_id", void 0);
let DistribuicaoController = class DistribuicaoController {
    constructor(distribuicaoService) {
        this.distribuicaoService = distribuicaoService;
    }
    criar(createDistribuicaoDto) {
        return this.distribuicaoService.criar(createDistribuicaoDto);
    }
    atualizar(inicial_id, updateDistribuicaoDto) {
        return this.distribuicaoService.atualizar(+inicial_id, updateDistribuicaoDto);
    }
    mudarAdministrativoResponsavel(inicial_id, { administrativo_responsavel_id }) {
        return this.distribuicaoService.mudarAdministrativoResponsavel(+inicial_id, administrativo_responsavel_id);
    }
    mudarTecnicoResponsavel(inicial_id, { tecnico_responsavel_id }) {
        return this.distribuicaoService.mudarTecnicoResponsavel(+inicial_id, tecnico_responsavel_id);
    }
};
exports.DistribuicaoController = DistribuicaoController;
__decorate([
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para criação de distribuição.', type: create_distribuicao_dto_1.CreateDistribuicaoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se criar a distribuição com sucesso.', type: distribuicao_response_dto_1.DistribuicaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Criar uma distribuição.", summary: 'Crie distribuições.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_distribuicao_dto_1.CreateDistribuicaoDto]),
    __metadata("design:returntype", Promise)
], DistribuicaoController.prototype, "criar", null);
__decorate([
    (0, common_1.Patch)('atualizar/:inicial_id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de distribuição.', type: create_distribuicao_dto_1.CreateDistribuicaoDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar a distribuição com sucesso.', type: distribuicao_response_dto_1.DistribuicaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar uma distribuição.", summary: 'Atualize distribuições.' }),
    __param(0, (0, common_1.Param)('inicial_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_distribuicao_dto_1.UpdateDistribuicaoDto]),
    __metadata("design:returntype", Promise)
], DistribuicaoController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Patch)('administrativo/atualizar/:inicial_id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de adiministrativo.', type: UpdateAdministrativoResponsavelDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar o administrativo com sucesso.', type: distribuicao_response_dto_1.DistribuicaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar o adiministrativo.", summary: 'Atualize o adiministrativo.' }),
    __param(0, (0, common_1.Param)('inicial_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAdministrativoResponsavelDTO]),
    __metadata("design:returntype", Promise)
], DistribuicaoController.prototype, "mudarAdministrativoResponsavel", null);
__decorate([
    (0, common_1.Patch)('tecnico/atualizar/:inicial_id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de tecnico.', type: UpdateTecnicoResponsavelDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar o tecnico com sucesso.', type: distribuicao_response_dto_1.DistribuicaoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar o tecnico.", summary: 'Atualize o tecnico.' }),
    __param(0, (0, common_1.Param)('inicial_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTecnicoResponsavelDTO]),
    __metadata("design:returntype", Promise)
], DistribuicaoController.prototype, "mudarTecnicoResponsavel", null);
exports.DistribuicaoController = DistribuicaoController = __decorate([
    (0, swagger_1.ApiTags)('Distribuição'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('distribuicao'),
    __metadata("design:paramtypes", [distribuicao_service_1.DistribuicaoService])
], DistribuicaoController);
//# sourceMappingURL=distribuicao.controller.js.map