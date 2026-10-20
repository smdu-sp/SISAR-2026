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
exports.CreateUnidadeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateUnidadeDto {
}
exports.CreateUnidadeDto = CreateUnidadeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({ message: 'Nome inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Sigla inválida!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "sigla", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Código inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Status inválido!' }),
    __metadata("design:type", Number)
], CreateUnidadeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Nivel_Unidade, default: client_1.Nivel_Unidade.UNIDADE }),
    (0, class_validator_1.IsEnum)(client_1.Nivel_Unidade, { message: 'Nível inválido!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "nivel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Id da unidade pai (hierarquia).' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Unidade pai inválida!' }),
    __metadata("design:type", String)
], CreateUnidadeDto.prototype, "unidade_pai_id", void 0);
//# sourceMappingURL=create-unidade.dto.js.map