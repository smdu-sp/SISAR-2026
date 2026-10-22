import { ForbiddenException, UnauthorizedException } from '../http/errors';
import { assinarToken } from '../http/autenticacao';
import { createClient } from 'ldapjs';
export class AuthService {
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
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
        const access_token = assinarToken(payload, process.env.JWT_SECRET, '15m');
        const refresh_token = assinarToken(payload, process.env.RT_SECRET, '7d');
        return { access_token, refresh_token };
    }
    async validateUser(login, senha) {
        let usuario = await this.usuariosService.buscarPorLogin(login);
        if (usuario && usuario.status === 3)
            throw new UnauthorizedException('Usuário aguardando aprovação de acesso ao sistema.');
        if (usuario && usuario.status === 2)
            throw new UnauthorizedException('Usuário inativo.');
        if (process.env.ENVIRONMENT == 'local') {
            if (usuario)
                return usuario;
        }
        const client = createClient({
            url: process.env.LDAP_SERVER,
        });
        await new Promise((resolve, reject) => {
            client.bind(`${login}${process.env.LDAP_DOMAIN}`, senha, (err) => {
                if (err) {
                    client.destroy();
                    reject(new UnauthorizedException('Credenciais incorretas.'));
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
                            reject(new ForbiddenException('Usuário criado, aguardando aprovação.'));
                        reject(new UnauthorizedException('Não foi possível fazer login no momento.'));
                    });
                });
            });
        }
        client.destroy();
        return usuario;
    }
}
