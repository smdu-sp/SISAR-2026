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
exports.AvisosController = void 0;
const common_1 = require("@nestjs/common");
const avisos_service_1 = require("./avisos.service");
const create_aviso_dto_1 = require("./dto/create-aviso.dto");
const update_aviso_dto_1 = require("./dto/update-aviso.dto");
const usuario_atual_decorator_1 = require("../auth/decorators/usuario-atual.decorator");
const swagger_1 = require("@nestjs/swagger");
const response_dto_1 = require("./dto/response.dto");
let AvisosController = class AvisosController {
    constructor(avisosService) {
        this.avisosService = avisosService;
    }
    create(createAvisoDto, usuario) {
        return this.avisosService.create(createAvisoDto, createAvisoDto.tipo === 1 ? usuario.id : null);
    }
    findOne(data, usuario) {
        return this.avisosService.findOne(data, usuario.id);
    }
    buscarPorMesAno(mes, ano, usuario) {
        return this.avisosService.buscarPorMesAno(parseInt(mes), parseInt(ano), usuario.id);
    }
    update(id, updateAvisoDto) {
        return this.avisosService.update(id, updateAvisoDto);
    }
    remove(id) {
        return this.avisosService.remove(id);
    }
};
exports.AvisosController = AvisosController;
__decorate([
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para criação de aviso.', type: create_aviso_dto_1.CreateAvisoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se criar o aviso com sucesso.', type: response_dto_1.AvisosResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Criar um aviso.", summary: 'Crie avisos.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aviso_dto_1.CreateAvisoDto, Object]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('buscar/:data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar o aviso por data com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar avisos por data.", summary: 'Busque avisos por data.' }),
    __param(0, (0, common_1.Param)('data')),
    __param(1, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date, Object]),
    __metadata("design:returntype", void 0)
], AvisosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('buscar/:mes/:ano'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar o aviso por mês e ano com sucesso.', type: [response_dto_1.AvisosResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Buscar avisos por mês e ano.", summary: 'Busque avisos por mês e ano.' }),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('ano')),
    __param(2, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "buscarPorMesAno", null);
__decorate([
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ description: 'Corpo da requisição para atualização de aviso.', type: update_aviso_dto_1.UpdateAvisoDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se atualizar o aviso por data com sucesso.', type: response_dto_1.AvisosResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar aviso.", summary: 'Atualize avisos.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_aviso_dto_1.UpdateAvisoDto]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('excluir/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se deletar o aviso com sucesso.', type: response_dto_1.AvisosResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    (0, swagger_1.ApiOperation)({ description: "Deletar aviso.", summary: 'Delete avisos.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvisosController.prototype, "remove", null);
exports.AvisosController = AvisosController = __decorate([
    (0, swagger_1.ApiTags)('Avisos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('avisos'),
    __metadata("design:paramtypes", [avisos_service_1.AvisosService])
], AvisosController);
//# sourceMappingURL=avisos.controller.js.map