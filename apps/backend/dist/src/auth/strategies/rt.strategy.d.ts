import { Strategy } from 'passport-jwt';
import { UsuarioPayload } from '../models/UsuarioPayload';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    private usuariosService;
    constructor(usuariosService: UsuariosService);
    validate(payload: UsuarioPayload): Promise<Usuario>;
}
export {};
