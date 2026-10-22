import { ForbiddenException, UnauthorizedException } from '../http/errors';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
import { UsuarioPayload } from './models/UsuarioPayload';
import { assinarToken } from '../http/autenticacao';
import { UsuarioToken } from './models/UsuarioToken';
import { UsuarioJwt } from './models/UsuarioJwt';

export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  async login(usuario: Usuario): Promise<UsuarioToken> {
    const { access_token, refresh_token } = await this.getTokens(usuario);
    return { access_token, refresh_token };
  }

  async refresh(usuario: Usuario) {
    const { access_token, refresh_token } = await this.getTokens(usuario);
    return { access_token, refresh_token };
  }

  async getTokens(usuario: UsuarioJwt) {
    const { id, login, nome, email, permissao, status } = usuario;
    const payload: UsuarioPayload = { sub: id, login, nome, email, permissao, status };
    const access_token = assinarToken(payload, process.env.JWT_SECRET, '15m');
    const refresh_token = assinarToken(payload, process.env.RT_SECRET, '7d');
    return { access_token, refresh_token };
  }

  async validateUser(login: string, senha: string) {
    let usuario = await this.usuariosService.buscarPorLogin(login);
    if (usuario && usuario.status === 3)
      throw new UnauthorizedException(
        'Usuário aguardando aprovação de acesso ao sistema.',
      );
    if (usuario && usuario.status === 2)
      throw new UnauthorizedException('Usuário inativo.');
    if (process.env.ENVIRONMENT == 'local') {
      if (usuario) return usuario;
    }
    const autenticado = await fetch(`${process.env.LDAP_API_URL}/auth/ldap/autenticar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, senha }),
    });
    if (!autenticado.ok)
      throw new UnauthorizedException('Credenciais incorretas.');
    if (!usuario) {
      const response = await fetch(
        `${process.env.LDAP_API_URL}/auth/ldap/buscar-por-login/${login}?secretarias=SMUL`,
      );
      if (!response.ok)
        throw new UnauthorizedException('Não foi possível fazer login no momento.');
      const { nome, email } = await response.json();
      const novoUsuario = await this.usuariosService.criar({
        nome,
        login,
        email: email.toLowerCase(),
        permissao: 'USR',
        cargo: 'ADM',
        status: 3,
      });
      if (novoUsuario)
        throw new ForbiddenException('Usuário criado, aguardando aprovação.');
      throw new UnauthorizedException('Não foi possível fazer login no momento.');
    }
    return usuario;
  }
}
