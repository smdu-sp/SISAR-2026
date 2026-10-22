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
import { IsDate, IsEmail, IsEnum, IsNumber, IsString, MinLength, } from 'class-validator';
export class CreateUsuarioDto {
}
__decorate([
    MinLength(10, { message: 'Nome tem de ter ao menos 10 caracteres.' }),
    IsString({ message: 'Tem de ser texto.' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nome", void 0);
__decorate([
    IsString({ message: 'Login inválido!' }),
    MinLength(7, { message: 'Login tem de ter ao menos 7 caracteres.' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "login", void 0);
__decorate([
    IsString({ message: 'Login inválido!' }),
    IsEmail({}, { message: 'Login tem de ter ao menos 7 caracteres.' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    IsString({ message: 'Unidade inválida!' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "unidade_id", void 0);
__decorate([
    IsEnum($Enums.Permissao, { message: 'Escolha uma permissão válida.' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "permissao", void 0);
__decorate([
    IsEnum($Enums.Cargo, { message: 'Escolha um cargo válido.' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "cargo", void 0);
__decorate([
    IsNumber({}, { message: 'Status inválido!' }),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "status", void 0);
export class AddFeriasDto {
}
__decorate([
    IsDate({ message: 'Tem de ser uma data válida.' }),
    __metadata("design:type", Date)
], AddFeriasDto.prototype, "inicio", void 0);
__decorate([
    IsDate({ message: 'Tem de ser uma data válida.' }),
    __metadata("design:type", Date)
], AddFeriasDto.prototype, "final", void 0);
