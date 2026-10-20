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
exports.ParecerAdmissibilidadePaginadoDTO = exports.ParecerAdmissibilidadeResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class ParecerAdmissibilidadeResponseDTO {
}
exports.ParecerAdmissibilidadeResponseDTO = ParecerAdmissibilidadeResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParecerAdmissibilidadeResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParecerAdmissibilidadeResponseDTO.prototype, "parecer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParecerAdmissibilidadeResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ParecerAdmissibilidadeResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ParecerAdmissibilidadeResponseDTO.prototype, "alterado_em", void 0);
class ParecerAdmissibilidadePaginadoDTO {
}
exports.ParecerAdmissibilidadePaginadoDTO = ParecerAdmissibilidadePaginadoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParecerAdmissibilidadePaginadoDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParecerAdmissibilidadePaginadoDTO.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ParecerAdmissibilidadePaginadoDTO.prototype, "limite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ParecerAdmissibilidadePaginadoDTO.prototype, "data", void 0);
//# sourceMappingURL=parecer_admissibilidade-resopnse.dto.js.map