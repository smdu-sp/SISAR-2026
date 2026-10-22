var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { $Enums } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
export class CreatePublicacaoDto {
}
__decorate([
    IsString({ message: 'Número do processo inválido.' }),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "numero_processo", void 0);
__decorate([
    IsEnum($Enums.Tipo_Documento, {
        message: 'Escolha um tipo de documento válido.',
    }),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "tipo_documento", void 0);
__decorate([
    IsEnum($Enums.Colegiado, { message: 'Escolha um colegiado válido.' }),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "colegiado", void 0);
__decorate([
    IsString({ message: 'Técnico inválido.' }),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "tecnico_rf", void 0);
__decorate([
    IsString({ message: 'Unidade inválida.' }),
    __metadata("design:type", String)
], CreatePublicacaoDto.prototype, "unidade_id", void 0);
__decorate([
    IsDate({ message: 'Data de emissão inválida.' }),
    __metadata("design:type", Date)
], CreatePublicacaoDto.prototype, "data_emissao", void 0);
__decorate([
    IsDate({ message: 'Data de publicação inválida.' }),
    __metadata("design:type", Date)
], CreatePublicacaoDto.prototype, "data_publicacao", void 0);
__decorate([
    IsNumber({}, { message: 'Prazo inválido.' }),
    __metadata("design:type", Number)
], CreatePublicacaoDto.prototype, "prazo", void 0);
