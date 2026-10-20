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
exports.EnviarRelatorioEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EnviarRelatorioEmailDto {
}
exports.EnviarRelatorioEmailDto = EnviarRelatorioEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['usuario@dominio.gov.br'],
        description: 'Lista de destinatarios do email.',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], EnviarRelatorioEmailDto.prototype, "destinatarios", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Relatorio SISAR',
        description: 'Assunto do email. Se omitido, um assunto padrao sera usado.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "assunto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Segue relatorio em anexo.',
        description: 'Mensagem do corpo do email.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "mensagem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "dataInicial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "dataFinal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "anoInicial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "anoFinal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnviarRelatorioEmailDto.prototype, "periodo", void 0);
//# sourceMappingURL=enviar-relatorio-email.dto.js.map