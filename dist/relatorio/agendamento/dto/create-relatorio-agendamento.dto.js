var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEmail, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, } from 'class-validator';
import { TIPOS_RELATORIO } from '../../relatorio.constants';
export class CreateRelatorioAgendamentoDto {
}
__decorate([
    IsString(),
    MaxLength(150),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "nome", void 0);
__decorate([
    IsIn(TIPOS_RELATORIO, { message: 'Tipo de relatório inválido.' }),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "tipo_relatorio", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "formato_pdf", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "formato_excel", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ArrayMaxSize(50),
    IsEmail({}, { each: true, message: 'E-mail de destinatário inválido.' }),
    __metadata("design:type", Array)
], CreateRelatorioAgendamentoDto.prototype, "destinatarios", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(191),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "assunto", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "mensagem", void 0);
__decorate([
    IsEnum(Frequencia_Envio),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "frequencia", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(31),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "dia_do_mes", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    Max(6),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "dia_da_semana", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    Max(23),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "hora", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0),
    Max(59),
    __metadata("design:type", Number)
], CreateRelatorioAgendamentoDto.prototype, "minuto", void 0);
__decorate([
    IsOptional(),
    IsEnum(Periodo_Relatorio),
    __metadata("design:type", String)
], CreateRelatorioAgendamentoDto.prototype, "periodo", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateRelatorioAgendamentoDto.prototype, "ativo", void 0);
