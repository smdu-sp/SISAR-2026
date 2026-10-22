/** Substituto simples do Logger do NestJS (mesmo formato de uso). */
export class Logger {
    constructor(contexto) {
        this.contexto = contexto;
    }
    log(mensagem) {
        console.log(`[${this.contexto}] ${mensagem}`);
    }
    warn(mensagem) {
        console.warn(`[${this.contexto}] ${mensagem}`);
    }
    error(mensagem) {
        console.error(`[${this.contexto}] ${mensagem}`);
    }
}
