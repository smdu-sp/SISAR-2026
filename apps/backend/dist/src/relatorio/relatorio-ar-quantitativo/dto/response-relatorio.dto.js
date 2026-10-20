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
exports.PeriodFilterDto = exports.RelatorioResopnseDto = exports.RelatorioData = exports.Smul_Graproem = exports.Data = void 0;
const swagger_1 = require("@nestjs/swagger");
class Data {
}
exports.Data = Data;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Data.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Data.prototype, "count", void 0);
class Smul_Graproem {
}
exports.Smul_Graproem = Smul_Graproem;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Smul_Graproem.prototype, "quantidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Smul_Graproem.prototype, "data", void 0);
class RelatorioData {
}
exports.RelatorioData = RelatorioData;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Smul_Graproem)
], RelatorioData.prototype, "smul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Smul_Graproem)
], RelatorioData.prototype, "graproem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RelatorioData.prototype, "total_parcial", void 0);
class RelatorioResopnseDto {
}
exports.RelatorioResopnseDto = RelatorioResopnseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RelatorioResopnseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RelatorioResopnseDto.prototype, "analise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RelatorioResopnseDto.prototype, "inadimissiveis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RelatorioResopnseDto.prototype, "admissiveis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RelatorioResopnseDto.prototype, "data_gerado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RelatorioData)
], RelatorioResopnseDto.prototype, "em_analise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RelatorioData)
], RelatorioResopnseDto.prototype, "deferidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RelatorioData)
], RelatorioResopnseDto.prototype, "indeferidos", void 0);
class PeriodFilterDto {
}
exports.PeriodFilterDto = PeriodFilterDto;
//# sourceMappingURL=response-relatorio.dto.js.map