function criarCorpo(objetoOuErro, descricao, statusCode) {
    if (objetoOuErro === undefined || objetoOuErro === null || objetoOuErro === '') {
        return { message: descricao, statusCode };
    }
    if (typeof objetoOuErro === 'object' && !Array.isArray(objetoOuErro)) {
        return objetoOuErro;
    }
    return { message: objetoOuErro, error: descricao, statusCode };
}
/** Marca global: reconhece a exceção mesmo com módulos duplicados (recarga a quente). */
const MARCA = Symbol.for('sisar.HttpException');
export function ehHttpException(erro) {
    return !!erro && typeof erro === 'object' && erro[MARCA] === true;
}
export class HttpException extends Error {
    constructor(resposta, status, descricao = 'Error') {
        super(typeof resposta === 'string'
            ? resposta
            : Array.isArray(resposta)
                ? resposta.join(', ')
                : (resposta?.message ?? descricao));
        this.status = status;
        this.corpo = criarCorpo(resposta, descricao, status);
        this[MARCA] = true;
    }
}
function excecao(status, descricao) {
    return class extends HttpException {
        constructor(resposta) {
            super(resposta, status, descricao);
        }
    };
}
export class BadRequestException extends excecao(400, 'Bad Request') {
}
export class UnauthorizedException extends excecao(401, 'Unauthorized') {
}
export class ForbiddenException extends excecao(403, 'Forbidden') {
}
export class NotFoundException extends excecao(404, 'Not Found') {
}
export class ConflictException extends excecao(409, 'Conflict') {
}
export class InternalServerErrorException extends excecao(500, 'Internal Server Error') {
}
export class BadGatewayException extends excecao(502, 'Bad Gateway') {
}
