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
exports.CreateRelatorioAgendamentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const relatorio_constants_1 = require("../../relatorio.constants");
class CreateRelatorioAgendamentoDto {
}
exports.CreateRelatorioAgendamentoDto = CreateRelatorioAgendamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quantitativo mensal AR - Gabinete' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: relatorio_constants_1.TIPOS_RELATORIO }),
    (0, class_validator_1.IsIn)(relatorio_constants_1.TIPOS_RELATORIO, { message: 'Tipo de relatório inválido.' }),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "tipo_relatorio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "formato_pdf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "formato_excel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['a@dominio.gov.br', 'b@dominio.gov.br'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.IsEmail)({}, { each: true, message: 'E-mail de destinatário inválido.' }),
    __metadata("design:type", Array)
], CreateRelatorioAgendamentoDto.prototype, "destinatarios", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "assunto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "mensagem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Frequencia_Envio, default: client_1.Frequencia_Envio.MENSAL }),
    (0, class_validator_1.IsEnum)(client_1.Frequencia_Envio),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "frequencia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Obrigatório na frequência MENSAL (1-31).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "dia_do_mes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Obrigatório na frequência SEMANAL (0=domingo ... 6=sábado).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "dia_da_semana", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 8, description: 'Hora do envio (horário de Brasília).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(23),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "hora", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(59),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "minuto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Periodo_Relatorio, default: client_1.Periodo_Relatorio.MES_ANTERIOR }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Periodo_Relatorio),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "periodo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "ativo", void 0);
//# sourceMappingURL=create-relatorio-agendamento.dto.js.map