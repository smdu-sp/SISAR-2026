import { Strategy } from 'passport-jwt';
import { UsuarioPayload } from '../models/UsuarioPayload';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usuariosService;
    constructor(usuariosService: UsuariosService);
    validate(payload: UsuarioPayload): Promise<Usuario>;
}
export {};
