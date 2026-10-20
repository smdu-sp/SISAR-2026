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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarPedidoReconsideracaoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RegistrarPedidoReconsideracaoDto {
}
exports.RegistrarPedidoReconsideracaoDto = RegistrarPedidoReconsideracaoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], RegistrarPedidoReconsideracaoDto.prototype, "pedido_reconsideracao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RegistrarPedidoReconsideracaoDto.prototype, "envio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], RegistrarPedidoReconsideracaoDto.prototype, "publicacao", void 0);
//# sourceMappingURL=registrar-pedido.dto.js.map