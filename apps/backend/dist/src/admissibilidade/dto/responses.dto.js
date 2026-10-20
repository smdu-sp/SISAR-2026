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
exports.AdmissibilidadePaginado = exports.AdmissibilidadeResponseDTO = exports.CreateResponseAdmissibilidadeDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateResponseAdmissibilidadeDTO {
}
exports.CreateResponseAdmissibilidadeDTO = CreateResponseAdmissibilidadeDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateResponseAdmissibilidadeDTO.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateResponseAdmissibilidadeDTO.prototype, "unidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateResponseAdmissibilidadeDTO.prototype, "data_envio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateResponseAdmissibilidadeDTO.prototype, "data_decisao_interlocutoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateResponseAdmissibilidadeDTO.prototype, "parecer_admissibilidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateResponseAdmissibilidadeDTO.prototype, "subprefeitura_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateResponseAdmissibilidadeDTO.prototype, "categoria_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateResponseAdmissibilidadeDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateResponseAdmissibilidadeDTO.prototype, "reconsiderado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateResponseAdmissibilidadeDTO.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateResponseAdmissibilidadeDTO.prototype, "obs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateResponseAdmissibilidadeDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateResponseAdmissibilidadeDTO.prototype, "alterado_em", void 0);
class AdmissibilidadeResponseDTO {
}
exports.AdmissibilidadeResponseDTO = AdmissibilidadeResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadeResponseDTO.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmissibilidadeResponseDTO.prototype, "unidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdmissibilidadeResponseDTO.prototype, "data_envio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdmissibilidadeResponseDTO.prototype, "data_decisao_interlocutoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmissibilidadeResponseDTO.prototype, "parecer_admissibilidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmissibilidadeResponseDTO.prototype, "subprefeitura_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmissibilidadeResponseDTO.prototype, "categoria_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadeResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AdmissibilidadeResponseDTO.prototype, "reconsiderado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadeResponseDTO.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmissibilidadeResponseDTO.prototype, "obs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdmissibilidadeResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdmissibilidadeResponseDTO.prototype, "alterado_em", void 0);
class AdmissibilidadePaginado {
}
exports.AdmissibilidadePaginado = AdmissibilidadePaginado;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], AdmissibilidadePaginado.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadePaginado.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadePaginado.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmissibilidadePaginado.prototype, "limite", void 0);
//# sourceMappingURL=responses.dto.js.map