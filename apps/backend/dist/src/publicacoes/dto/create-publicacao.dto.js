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
exports.CreatePublicacaoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreatePublicacaoDto {
}
exports.CreatePublicacaoDto = CreatePublicacaoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Número do processo inválido.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "numero_processo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.$Enums.Tipo_Documento, {
        message: 'Escolha um tipo de documento válido.',
    }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "tipo_documento", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.$Enums.Colegiado, { message: 'Escolha um colegiado válido.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "colegiado", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Técnico inválido.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "tecnico_rf", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Unidade inválida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "unidade_id", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Data de emissão inválida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreatePublicacaoDto.prototype, "data_emissao", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Data de publicação inválida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreatePublicacaoDto.prototype, "data_publicacao", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Prazo inválido.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreatePublicacaoDto.prototype, "prazo", void 0);
//# sourceMappingURL=create-publicacao.dto.js.map