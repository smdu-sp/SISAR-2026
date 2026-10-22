/** Substituto simples do Logger do NestJS (mesmo formato de uso). */
export declare class Logger {
    private readonly contexto;
    constructor(contexto: string);
    log(mensagem: string): void;
    warn(mensagem: string): void;
    error(mensagem: string): void;
}
