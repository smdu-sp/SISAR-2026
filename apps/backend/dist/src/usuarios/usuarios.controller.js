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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const recurso_decorator_1 = require("../auth/decorators/recurso.decorator");
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const usuario_atual_decorator_1 = require("../auth/decorators/usuario-atual.decorator");
const swagger_1 = require("@nestjs/swagger");
const usuario_response_dto_1 = require("./dto/usuario-response.dto");
let UsuariosController = class UsuariosController {
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    criar(usuario, createUsuarioDto) {
        return this.usuariosService.criar(createUsuarioDto, usuario);
    }
    buscarTudo(usuario, pagina, limite, status, busca, permissao) {
        return this.usuariosService.buscarTudo(usuario, +pagina, +limite, status, busca, permissao);
    }
    buscarPorId(id) {
        return this.usuariosService.buscarPorId(id);
    }
    atualizar(usuario, id, updateUsuarioDto) {
        return this.usuariosService.atualizar(usuario, id, updateUsuarioDto);
    }
    listaCompleta() {
        return this.usuariosService.listaCompleta();
    }
    excluir(id) {
        return this.usuariosService.excluir(id);
    }
    autorizarUsuario(id) {
        return this.usuariosService.autorizaUsuario(id);
    }
    adicionaFerias(id, addFeriasDto) {
        return this.usuariosService.adicionaFerias(id, addFeriasDto);
    }
    validaUsuario(usuario) {
        return this.usuariosService.validaUsuario(usuario.id);
    }
    buscarNovo(login) {
        return this.usuariosService.buscarNovo(login);
    }
    buscarAdministrativos() {
        return this.usuariosService.buscarAdministrativos();
    }
    buscarFuncionarios() {
        return this.usuariosService.buscarFuncionarios();
    }
    adicionarSubstituto({ usuario_id, substituto_id }) {
        return this.usuariosService.adicionarSubstituto(usuario_id, substituto_id);
    }
    removerSubstituto(id) {
        return this.usuariosService.removerSubstituto(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Post)('criar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_usuario_dto_1.CreateUsuarioDto }),
    (0, swagger_1.ApiOperation)({ description: "Registrar um usuário.", summary: 'Registre um usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 201 se registrar o usuario com sucesso.', type: usuario_response_dto_1.UsuarioResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "criar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Get)('buscar-tudo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'pagina', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limite', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: 'string', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'busca', type: 'string', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'permissao', type: 'string', required: false }),
    (0, swagger_1.ApiOperation)({ description: "Buscar todos os usuários.", summary: 'Busque os usuários.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar os usuarios com sucesso.', type: usuario_response_dto_1.UsuarioPaginadoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __param(1, (0, common_1.Query)('pagina')),
    __param(2, (0, common_1.Query)('limite')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('busca')),
    __param(5, (0, common_1.Query)('permissao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "buscarTudo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Get)('buscar-por-id/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar usuário por ID.", summary: 'Busque um usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar um usuário com sucesso.', type: usuario_response_dto_1.UsuarioResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "buscarPorId", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Patch)('atualizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: update_usuario_dto_1.UpdateUsuarioDto }),
    (0, swagger_1.ApiOperation)({ description: "Atualizar usuário.", summary: 'Atualize um usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar os usuarios com sucesso.', type: usuario_response_dto_1.UsuarioResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_usuario_dto_1.UpdateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "atualizar", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Get)('lista-completa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Listar todos os usuários.", summary: 'Liste os usuários.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se listar os usuarios com sucesso.', type: [usuario_response_dto_1.UsuarioResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "listaCompleta", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Delete)('desativar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Deletar todos os usuários.", summary: 'Delete os usuários.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Retorna 200 se deletar o usuario com sucesso.', type: usuario_response_dto_1.UsuarioDesativadoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "excluir", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Patch)('autorizar/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Autorizar usuário.", summary: 'Autorize um usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se autorizar o usuário com sucesso.', type: usuario_response_dto_1.UsuarioAutorizadoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "autorizarUsuario", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Patch)('adiciona-ferias/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiBody)({ type: create_usuario_dto_1.AddFeriasDto }),
    (0, swagger_1.ApiOperation)({ description: "Adicionar férias do usuário.", summary: 'Adicionae férias ao usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se adicionar férias ao usuário com sucesso.', type: create_usuario_dto_1.AddFeriasDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_usuario_dto_1.AddFeriasDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "adicionaFerias", null);
__decorate([
    (0, recurso_decorator_1.AcessoLogado)(),
    (0, common_1.Get)('valida-usuario'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Validar usuário.", summary: 'Valide ao usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se validar usuário com sucesso.', type: usuario_response_dto_1.UsuarioResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, usuario_atual_decorator_1.UsuarioAtual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "validaUsuario", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Get)('buscar-novo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({ name: 'login', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Buscar novo usuário.", summary: 'Busque um novo usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar usuário com sucesso.', type: usuario_response_dto_1.BuscarNovoResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Query)('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "buscarNovo", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Get)('buscar-administrativos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Buscar administrativos.", summary: 'Busque administrativios.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar administrativos com sucesso.', type: [usuario_response_dto_1.UsuarioResponseDTO] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "buscarAdministrativos", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios', 'processos'),
    (0, common_1.Get)('buscar-funcionarios'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ description: "Buscar funcionários.", summary: 'Busque funcionários.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se buscar funcionários com sucesso.', type: usuario_response_dto_1.BuscarFuncionariosResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "buscarFuncionarios", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Post)('adicionar-substituto'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ description: "Adicionar substituto.", summary: 'Adicionar substituto ao usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se adicionar substituto ao usuário com sucesso.', type: usuario_response_dto_1.AddSubstitutoDTO }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_response_dto_1.AddSubstitutoDTO]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "adicionarSubstituto", null);
__decorate([
    (0, recurso_decorator_1.Recurso)('usuarios'),
    (0, common_1.Delete)('remover-substituto/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', required: true }),
    (0, swagger_1.ApiOperation)({ description: "Deletar usuário.", summary: 'Delete ao usuário.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna 200 se deletar usuário com sucesso.', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Retorna 401 se não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "removerSubstituto", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, swagger_1.ApiTags)('Usuarios'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map