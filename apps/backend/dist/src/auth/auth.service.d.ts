import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsuarioToken } from './models/UsuarioToken';
import { UsuarioJwt } from './models/UsuarioJwt';
export declare class AuthService {
    private readonly usuariosService;
    private readonly jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
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
