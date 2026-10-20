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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("../usuarios/usuarios.service");
const jwt_1 = require("@nestjs/jwt");
const ldapjs_1 = require("ldapjs");
let AuthService = class AuthService {
    constructor(usuariosService, jwtService) {
        this.usuariosService = usuariosService;
        this.jwtService = jwtService;
    }
    async login(usuario) {
        const { access_token, refresh_token } = await this.getTokens(usuario);
        return { access_token, refresh_token };
    }
    async refresh(usuario) {
        const { access_token, refresh_token } = await this.getTokens(usuario);
        return { access_token, refresh_token };
    }
    async getTokens(usuario) {
        const { id, login, nome, email, permissao, status } = usuario;
        const payload = { sub: id, login, nome, email, permissao, status };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: process.env.JWT_SECRET,
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: process.env.RT_SECRET,
        });
        return { access_token, refresh_token };
    }
    async validateUser(login, senha) {
        let usuario = await this.usuariosService.buscarPorLogin(login);
        if (usuario && usuario.status === 3)
            throw new common_1.UnauthorizedException('Usuário aguardando aprovação de acesso ao sistema.');
        if (usuario && usuario.status === 2)
            throw new common_1.UnauthorizedException('Usuário inativo.');
        if (process.env.ENVIRONMENT == 'local') {
            if (usuario)
                return usuario;
        }
        const client = (0, ldapjs_1.createClient)({
            url: process.env.LDAP_SERVER,
        });
        await new Promise((resolve, reject) => {
            client.bind(`${login}${process.env.LDAP_DOMAIN}`, senha, (err) => {
                if (err) {
                    client.destroy();
                    reject(new common_1.UnauthorizedException('Credenciais incorretas.'));
                }
                resolve();
            });
        });
        if (!usuario) {
            usuario = await new Promise((resolve, reject) => {
                client.search(process.env.LDAP_BASE, {
                    filter: `(&(samaccountname=${login}))`,
                    scope: 'sub',
                    attributes: ['name', 'mail'],
                }, (err, res) => {
                    if (err) {
                        client.destroy();
                        reject();
                    }
                    res.on('searchEntry', async (entry) => {
                        const { name, mail } = Object.fromEntries(entry.pojo.attributes.map(({ type, values }) => [type, values[0]]));
                        const novoUsuario = await this.usuariosService.criar({
                            nome: name,
                            login,
                            email: mail.toLowerCase(),
                            permissao: 'USR',
                            cargo: 'ADM',
                            status: 3,
                        });
                        client.destroy();
                        if (novoUsuario)
                            reject(new common_1.ForbiddenException('Usuário criado, aguardando aprovação.'));
                        reject(new common_1.UnauthorizedException('Não foi possível fazer login no momento.'));
                    });
                });
            });
        }
        client.destroy();
        return usuario;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map