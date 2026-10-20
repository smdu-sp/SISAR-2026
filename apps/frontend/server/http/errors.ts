/**
 * Exceções HTTP com o mesmo formato de corpo do NestJS ({ message, error, statusCode }),
 * para que o frontend e os testes não percebam a troca de framework.
 */
export type ErroResposta = string | string[] | number | Record<string, unknown>;

function criarCorpo(
	objetoOuErro: ErroResposta | undefined | null,
	descricao: string,
	statusCode: number,
): Record<string, unknown> {
	if (objetoOuErro === undefined || objetoOuErro === null || objetoOuErro === '') {
		return { message: descricao, statusCode };
	}
	if (typeof objetoOuErro === 'object' && !Array.isArray(objetoOuErro)) {
		return objetoOuErro as Record<string, unknown>;
	}
	return { message: objetoOuErro, error: descricao, statusCode };
}

export class HttpException extends Error {
	readonly corpo: Record<string, unknown>;

	constructor(
		resposta: ErroResposta | undefined | null,
		readonly status: number,
		descricao = 'Error',
	) {
		super(
			typeof resposta === 'string'
				? resposta
				: Array.isArray(resposta)
					? resposta.join(', ')
					: ((resposta as { message?: string } | undefined)?.message ?? descricao),
		);
		this.corpo = criarCorpo(resposta, descricao, status);
	}
}

function excecao(status: number, descricao: string) {
	return class extends HttpException {
		constructor(resposta?: ErroResposta) {
			super(resposta, status, descricao);
		}
	};
}

export class BadRequestException extends excecao(400, 'Bad Request') {}
export class UnauthorizedException extends excecao(401, 'Unauthorized') {}
export class ForbiddenException extends excecao(403, 'Forbidden') {}
export class NotFoundException extends excecao(404, 'Not Found') {}
export class ConflictException extends excecao(409, 'Conflict') {}
export class InternalServerErrorException extends excecao(500, 'Internal Server Error') {}
export class BadGatewayException extends excecao(502, 'Bad Gateway') {}
