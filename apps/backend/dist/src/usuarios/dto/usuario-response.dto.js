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
exports.UsuarioAutorizadoResponseDTO = exports.UsuarioDesativadoResponseDTO = exports.AddSubstitutoDTO = exports.BuscarFuncionariosResponseDTO = exports.BuscarNovoResponseDTO = exports.UsuarioPaginadoResponseDTO = exports.UsuarioResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UsuarioResponseDTO {
}
exports.UsuarioResponseDTO = UsuarioResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "login", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "cargo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "permissao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsuarioResponseDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UsuarioResponseDTO.prototype, "criado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UsuarioResponseDTO.prototype, "alterado_em", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDTO.prototype, "unidade_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], UsuarioResponseDTO.prototype, "unidade", void 0);
class UsuarioPaginadoResponseDTO {
}
exports.UsuarioPaginadoResponseDTO = UsuarioPaginadoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsuarioPaginadoResponseDTO.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsuarioPaginadoResponseDTO.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsuarioPaginadoResponseDTO.prototype, "limite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], UsuarioPaginadoResponseDTO.prototype, "data", void 0);
class BuscarNovoResponseDTO {
}
exports.BuscarNovoResponseDTO = BuscarNovoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuscarNovoResponseDTO.prototype, "login", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuscarNovoResponseDTO.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuscarNovoResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BuscarNovoResponseDTO.prototype, "unidade_id", void 0);
class BuscarFuncionariosResponseDTO {
}
exports.BuscarFuncionariosResponseDTO = BuscarFuncionariosResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], BuscarFuncionariosResponseDTO.prototype, "administrativos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], BuscarFuncionariosResponseDTO.prototype, "tecnicos", void 0);
class AddSubstitutoDTO {
}
exports.AddSubstitutoDTO = AddSubstitutoDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AddSubstitutoDTO.prototype, "usuario_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AddSubstitutoDTO.prototype, "substituto_id", void 0);
class UsuarioDesativadoResponseDTO {
}
exports.UsuarioDesativadoResponseDTO = UsuarioDesativadoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UsuarioDesativadoResponseDTO.prototype, "desativado", void 0);
class UsuarioAutorizadoResponseDTO {
}
exports.UsuarioAutorizadoResponseDTO = UsuarioAutorizadoResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UsuarioAutorizadoResponseDTO.prototype, "autorizado", void 0);
//# sourceMappingURL=usuario-response.dto.js.map