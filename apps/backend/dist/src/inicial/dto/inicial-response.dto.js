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
exports.InicialProcessosMesAnoResponseDTO = exports.InicialProcessosResponseDTO = exports.SqlResponseDTO = exports.InicialResponseDTO = exports.IniciaisPaginado = void 0;
const swagger_1 = require("@nestjs/swagger");
class IniciaisPaginado {
}
exports.IniciaisPaginado = IniciaisPaginado;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], IniciaisPaginado.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IniciaisPaginado.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IniciaisPaginado.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], IniciaisPaginado.prototype, "limite", void 0);
class InicialResponseDTO {
}
exports.InicialResponseDTO = InicialResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], InicialResponseDTO.prototype, "decreto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "sei", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialResponseDTO.prototype, "tipo_requerimento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "requerimento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "aprova_digital", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "processo_fisico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "data_protocolo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "envio_admissibilidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "alvara_tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "alvara_tipo_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialResponseDTO.prototype, "tipo_processo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialResponseDTO.prototype, "obs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialResponseDTO.prototype, "pagamento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], InicialResponseDTO.prototype, "requalifica_rapido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], InicialResponseDTO.prototype, "associado_reforma", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "data_limiteSmul", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "data_limiteMulti", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "comunique_ses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "controles_prazo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "decisoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "motivos_inadmissao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "pedidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "reunioes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "suspensoes_prazo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "iniciais_sqls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], InicialResponseDTO.prototype, "avisos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "admissibilidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "conclusao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "distribuicao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "reconsideracao_admissibilidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], InicialResponseDTO.prototype, "interfaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialResponseDTO.prototype, "alterado_em", void 0);
class SqlResponseDTO {
}
exports.SqlResponseDTO = SqlResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SqlResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SqlResponseDTO.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SqlResponseDTO.prototype, "sql", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SqlResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SqlResponseDTO.prototype, "alterado_em", void 0);
class InicialProcessosResponseDTO {
}
exports.InicialProcessosResponseDTO = InicialProcessosResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialProcessosResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialProcessosResponseDTO.prototype, "sei", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialProcessosResponseDTO.prototype, "aprova_digital", void 0);
class InicialProcessosMesAnoResponseDTO {
}
exports.InicialProcessosMesAnoResponseDTO = InicialProcessosMesAnoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialProcessosMesAnoResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InicialProcessosMesAnoResponseDTO.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialProcessosMesAnoResponseDTO.prototype, "data_reuniao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialProcessosMesAnoResponseDTO.prototype, "data_processo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialProcessosMesAnoResponseDTO.prototype, "nova_data_reuniao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InicialProcessosMesAnoResponseDTO.prototype, "justificativa_remarcacao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialProcessosMesAnoResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], InicialProcessosMesAnoResponseDTO.prototype, "alterado_em", void 0);
//# sourceMappingURL=inicial-response.dto.js.map