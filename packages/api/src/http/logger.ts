/** Substituto simples do Logger do NestJS (mesmo formato de uso). */
export class Logger {
	constructor(private readonly contexto: string) {}
	log(mensagem: string) {
		console.log(`[${this.contexto}] ${mensagem}`);
	}
	warn(mensagem: string) {
		console.warn(`[${this.contexto}] ${mensagem}`);
	}
	error(mensagem: string) {
		console.error(`[${this.contexto}] ${mensagem}`);
	}
}
