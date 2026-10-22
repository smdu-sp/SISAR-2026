import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
import { UsuarioToken } from './models/UsuarioToken';
import { UsuarioJwt } from './models/UsuarioJwt';
export declare class AuthService {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    login(usuario: Usuario): Promise<UsuarioToken>;
    refresh(usuario: Usuario): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getTokens(usuario: UsuarioJwt): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    validateUser(login: string, senha: string): Promise<import("../usuarios/dto/usuario-response.dto").UsuarioResponseDTO>;
}
