import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from './errors';
/**
 * Equivalente ao ValidationPipe({ whitelist: true, transform: true }) do Nest:
 * remove propriedades desconhecidas e responde 400 com a lista de mensagens.
 */
export async function validarDto(classe, dados, opcoes = { whitelist: true }) {
    const instancia = plainToInstance(classe, dados ?? {});
    const erros = await validate(instancia, {
        whitelist: opcoes.whitelist ?? true,
    });
    if (erros.length > 0) {
        const mensagens = erros.flatMap((e) => Object.values(e.constraints ?? {}));
        throw new BadRequestException(mensagens);
    }
    return instancia;
}
