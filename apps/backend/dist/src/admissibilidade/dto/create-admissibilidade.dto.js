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
exports.IInterfaces = exports.CreateAdmissibilidadeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAdmissibilidadeDto {
}
exports.CreateAdmissibilidadeDto = CreateAdmissibilidadeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAdmissibilidadeDto.prototype, "inicial_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateAdmissibilidadeDto.prototype, "unidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateAdmissibilidadeDto.prototype, "data_envio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateAdmissibilidadeDto.prototype, "data_decisao_interlocutoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateAdmissibilidadeDto.prototype, "parecer_admissibilidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateAdmissibilidadeDto.prototype, "subprefeitura_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateAdmissibilidadeDto.prototype, "categoria_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAdmissibilidadeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateAdmissibilidadeDto.prototype, "tipo_processo", void 0);
class IInterfaces {
    constructor() {
        this.interface_sehab = false;
        this.interface_siurb = false;
        this.interface_smc = false;
        this.interface_smt = false;
        this.interface_svma = false;
    }
}
exports.IInterfaces = IInterfaces;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], IInterfaces.prototype, "interface_sehab", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], IInterfaces.prototype, "interface_siurb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], IInterfaces.prototype, "interface_smc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], IInterfaces.prototype, "interface_smt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], IInterfaces.prototype, "interface_svma", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IInterfaces.prototype, "num_sehab", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IInterfaces.prototype, "num_siurb", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IInterfaces.prototype, "num_smc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IInterfaces.prototype, "num_smt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IInterfaces.prototype, "num_svma", void 0);
//# sourceMappingURL=create-admissibilidade.dto.js.map