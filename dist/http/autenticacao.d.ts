export interface UsuarioPayload {
    sub: string;
    login: string;
    email: string;
    nome: string;
    permissao: string;
    status: number;
    iat?: number;
    exp?: number;
}
/** Equivale ao ExtractJwt.fromAuthHeaderAsBearerToken do passport-jwt. */
export declare function tokenBearer(req: Request): string | null;
export declare function verificarToken(token: string | null | undefined, segredo: string | undefined): UsuarioPayload;
export declare function assinarToken(payload: object, segredo: string | undefined, expiraEm: string): string;
