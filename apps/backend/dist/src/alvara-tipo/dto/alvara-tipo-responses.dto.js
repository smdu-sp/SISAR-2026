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
exports.AlvaraTipoPaginadoDTO = exports.AlvaraTipoResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class AlvaraTipoResponseDTO {
}
exports.AlvaraTipoResponseDTO = AlvaraTipoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlvaraTipoResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AlvaraTipoResponseDTO.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_admissibilidade_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "reconsideracao_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "reconsideracao_smul_tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "analise_reconsideracao_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_analise_smul1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_analise_smul2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_emissao_alvara_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_admissibilidade_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "reconsideracao_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "reconsideracao_multi_tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "analise_reconsideracao_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_analise_multi1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_analise_multi2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_emissao_alvara_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_comunique_se", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "prazo_encaminhar_coord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AlvaraTipoResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AlvaraTipoResponseDTO.prototype, "alterado_em", void 0);
class AlvaraTipoPaginadoDTO {
}
exports.AlvaraTipoPaginadoDTO = AlvaraTipoPaginadoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoPaginadoDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoPaginadoDTO.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AlvaraTipoPaginadoDTO.prototype, "limite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], AlvaraTipoPaginadoDTO.prototype, "data", void 0);
//# sourceMappingURL=alvara-tipo-responses.dto.js.map