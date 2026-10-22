import 'reflect-metadata';
type Construtor<T> = new () => T;
/**
 * Equivalente ao ValidationPipe({ whitelist: true, transform: true }) do Nest:
 * remove propriedades desconhecidas e responde 400 com a lista de mensagens.
 */
export declare function validarDto<T extends object>(classe: Construtor<T>, dados: unknown, opcoes?: {
    whitelist?: boolean;
}): Promise<T>;
export {};
