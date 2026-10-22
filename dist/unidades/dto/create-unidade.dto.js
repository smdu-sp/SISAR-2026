var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Nivel_Unidade } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
export class CreateUnidadeDto {
}
__decorate([
    IsString({ message: 'Nome inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "nome", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Sigla inválida!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "sigla", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Código inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "codigo", void 0);
__decorate([
    IsOptional(),
    IsInt({ message: 'Status inválido!' }),
    __metadata("design:type", Number)
], CreateUnidadeDto.prototype, "status", void 0);
__decorate([
    IsEnum(Nivel_Unidade, { message: 'Nível inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "nivel", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Unidade pai inválida!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "unidade_pai_id", void 0);
