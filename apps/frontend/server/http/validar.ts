import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from './errors';

type Construtor<T> = new () => T;

/**
 * Equivalente ao ValidationPipe({ whitelist: true, transform: true }) do Nest:
 * remove propriedades desconhecidas e responde 400 com a lista de mensagens.
 */
export async function validarDto<T extends object>(
	classe: Construtor<T>,
	dados: unknown,
	opcoes: { whitelist?: boolean } = { whitelist: true },
): Promise<T> {
	const instancia = plainToInstance(classe, dados ?? {});
	const erros = await validate(instancia as object, {
		whitelist: opcoes.whitelist ?? true,
	});
	if (erros.length > 0) {
		const mensagens = erros.flatMap((e) => Object.values(e.constraints ?? {}));
		throw new BadRequestException(mensagens);
	}
	return instancia;
}
