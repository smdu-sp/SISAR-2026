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
exports.InadmitirDto = exports.AdmitirDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_admissibilidade_dto_1 = require("./create-admissibilidade.dto");
class AdmitirDto {
}
exports.AdmitirDto = AdmitirDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmitirDto.prototype, "unidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdmitirDto.prototype, "subprefeitura_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AdmitirDto.prototype, "data_decisao_interlocutoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdmitirDto.prototype, "tipo_processo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", create_admissibilidade_dto_1.IInterfaces)
], AdmitirDto.prototype, "interfaces", void 0);
class InadmitirDto {
}
exports.InadmitirDto = InadmitirDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], InadmitirDto.prototype, "parecer_admissibilidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], InadmitirDto.prototype, "obs", void 0);
//# sourceMappingURL=admitir.dto.js.map