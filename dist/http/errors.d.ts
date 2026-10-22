/**
 * Exceções HTTP com o mesmo formato de corpo do NestJS ({ message, error, statusCode }),
 * para que o frontend e os testes não percebam a troca de framework.
 */
export type ErroResposta = string | string[] | number | Record<string, unknown>;
export declare function ehHttpException(erro: unknown): erro is HttpException;
export declare class HttpException extends Error {
    readonly status: number;
    readonly corpo: Record<string, unknown>;
    constructor(resposta: ErroResposta | undefined | null, status: number, descricao?: string);
}
declare const BadRequestException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class BadRequestException extends BadRequestException_base {
}
declare const UnauthorizedException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class UnauthorizedException extends UnauthorizedException_base {
}
declare const ForbiddenException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class ForbiddenException extends ForbiddenException_base {
}
declare const NotFoundException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class NotFoundException extends NotFoundException_base {
}
declare const ConflictException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class ConflictException extends ConflictException_base {
}
declare const InternalServerErrorException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class InternalServerErrorException extends InternalServerErrorException_base {
}
declare const BadGatewayException_base: {
    new (resposta?: ErroResposta): {
        readonly corpo: Record<string, unknown>;
        readonly status: number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class BadGatewayException extends BadGatewayException_base {
}
export {};
