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
exports.AddFeriasDto = exports.CreateUsuarioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateUsuarioDto {
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, class_validator_1.MinLength)(10, { message: 'Nome tem de ter ao menos 10 caracteres.' }),
    (0, class_validator_1.IsString)({ message: 'Tem de ser texto.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Login inválido!' }),
    (0, class_validator_1.MinLength)(7, { message: 'Login tem de ter ao menos 7 caracteres.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "login", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Login inválido!' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Login tem de ter ao menos 7 caracteres.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Unidade inválida!' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "unidade_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.$Enums.Permissao, { message: 'Escolha uma permissão válida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "permissao", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.$Enums.Cargo, { message: 'Escolha um cargo válido.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "cargo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Status inválido!' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "status", void 0);
class AddFeriasDto {
}
exports.AddFeriasDto = AddFeriasDto;
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Tem de ser uma data válida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AddFeriasDto.prototype, "inicio", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Tem de ser uma data válida.' }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AddFeriasDto.prototype, "final", void 0);
//# sourceMappingURL=create-usuario.dto.js.map