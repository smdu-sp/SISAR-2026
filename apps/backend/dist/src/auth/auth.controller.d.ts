import { AuthService } from './auth.service';
import { AuthRequest } from './models/AuthRequest';
import { Usuario } from '@prisma/client';
import { UsuarioToken } from './models/UsuarioToken';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: AuthRequest): Promise<UsuarioToken>;
    refresh(usuario: Usuario): Promise<UsuarioToken>;
    usuarioAtual(usuario: Usuario): {
        id: string;
        nome: string;
        login: string;
        email: string;
        cargo: import(".prisma/client").$Enums.Cargo;
        permissao: import(".prisma/client").$Enums.Permissao;
        status: number;
        criado_em: Date;
        alterado_em: Date;
        unidade_id: string | null;
    };
}
