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
exports.CreateAlvaraTipoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAlvaraTipoDto {
}
exports.CreateAlvaraTipoDto = CreateAlvaraTipoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateAlvaraTipoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_admissibilidade_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "reconsideracao_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "reconsideracao_smul_tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "analise_reconsideracao_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_analise_smul1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_analise_smul2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_emissao_alvara_smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_admissibilidade_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "reconsideracao_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "reconsideracao_multi_tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "analise_reconsideracao_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_analise_multi1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_analise_multi2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_emissao_alvara_multi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_comunique_se", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "prazo_encaminhar_coord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAlvaraTipoDto.prototype, "status", void 0);
//# sourceMappingURL=create-alvara-tipo.dto.js.map