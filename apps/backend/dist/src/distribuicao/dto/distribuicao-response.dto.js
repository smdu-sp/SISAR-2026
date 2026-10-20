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
exports.DistribuicaoResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class DistribuicaoResponseDTO {
}
exports.DistribuicaoResponseDTO = DistribuicaoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DistribuicaoResponseDTO.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DistribuicaoResponseDTO.prototype, "tecnico_responsavel_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DistribuicaoResponseDTO.prototype, "administrativo_responsavel_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DistribuicaoResponseDTO.prototype, "processo_relacionado_incomum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DistribuicaoResponseDTO.prototype, "assunto_processo_relacionado_incomum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DistribuicaoResponseDTO.prototype, "baixa_pagamento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DistribuicaoResponseDTO.prototype, "obs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DistribuicaoResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DistribuicaoResponseDTO.prototype, "alterado_em", void 0);
//# sourceMappingURL=distribuicao-response.dto.js.map