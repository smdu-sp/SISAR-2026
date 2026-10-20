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
exports.ImportarInicialResponseDTO = exports.DetalheLinhaImportacaoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class DetalheLinhaImportacaoDTO {
}
exports.DetalheLinhaImportacaoDTO = DetalheLinhaImportacaoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetalheLinhaImportacaoDTO.prototype, "linha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetalheLinhaImportacaoDTO.prototype, "sei", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['criado', 'duplicado', 'erro'] }),
    __metadata("design:type", String)
], DetalheLinhaImportacaoDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], DetalheLinhaImportacaoDTO.prototype, "mensagem", void 0);
class ImportarInicialResponseDTO {
}
exports.ImportarInicialResponseDTO = ImportarInicialResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de linhas de dados lidas na planilha.' }),
    __metadata("design:type", Number)
], ImportarInicialResponseDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Processos criados com sucesso.' }),
    __metadata("design:type", Number)
], ImportarInicialResponseDTO.prototype, "criados", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Linhas ignoradas por SEI já existente.' }),
    __metadata("design:type", Number)
], ImportarInicialResponseDTO.prototype, "duplicados", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Linhas com erro de validação/criação.' }),
    __metadata("design:type", Number)
], ImportarInicialResponseDTO.prototype, "erros", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DetalheLinhaImportacaoDTO] }),
    __metadata("design:type", Array)
], ImportarInicialResponseDTO.prototype, "detalhes", void 0);
//# sourceMappingURL=importar-inicial.dto.js.map