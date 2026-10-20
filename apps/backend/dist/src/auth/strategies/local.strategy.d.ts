import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(login: string, senha: string): Promise<import("../../usuarios/dto/usuario-response.dto").UsuarioResponseDTO>;
}
export {};
