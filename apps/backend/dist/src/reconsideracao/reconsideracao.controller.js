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
exports.ReconsideracaoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reconsideracao_service_1 = require("./reconsideracao.service");
const registrar_pedido_dto_1 = require("./dto/registrar-pedido.dto");
let ReconsideracaoController = class ReconsideracaoController {
    constructor(service) {
        this.service = service;
    }
    buscar(inicialId) {
        return this.service.buscar(+inicialId);
    }
    registrarPedido(inicialId, dto) {
        return this.service.registrarPedido(+inicialId, dto);
    }
    aceitar(inicialId) {
        return this.service.aceitar(+inicialId);
    }
    rejeitar(inicialId) {
        return this.service.rejeitar(+inicialId);
    }
};
exports.ReconsideracaoController = ReconsideracaoController;
__decorate([
    (0, common_1.Get)(':inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconsideracaoController.prototype, "buscar", null);
__decorate([
    (0, common_1.Post)('pedido/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: registrar_pedido_dto_1.RegistrarPedidoReconsideracaoDto }),
    __param(0, (0, common_1.Param)('inicialId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, registrar_pedido_dto_1.RegistrarPedidoReconsideracaoDto]),
    __metadata("design:returntype", void 0)
], ReconsideracaoController.prototype, "registrarPedido", null);
__decorate([
    (0, common_1.Patch)('aceitar/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Aceita pedido e encaminha à análise técnica' }),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconsideracaoController.prototype, "aceitar", null);
__decorate([
    (0, common_1.Patch)('rejeitar/:inicialId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeita pedido — via ordinária' }),
    __param(0, (0, common_1.Param)('inicialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconsideracaoController.prototype, "rejeitar", null);
exports.ReconsideracaoController = ReconsideracaoController = __decorate([
    (0, swagger_1.ApiTags)('Reconsideração admissibilidade'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reconsideracao-admissibilidade'),
    __metadata("design:paramtypes", [reconsideracao_service_1.ReconsideracaoService])
], ReconsideracaoController);
//# sourceMappingURL=reconsideracao.controller.js.map