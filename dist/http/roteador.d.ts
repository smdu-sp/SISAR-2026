import type { Contexto, Rota, RotaCompilada } from './tipos';
/** Equivale a um @Controller('prefixo'): as rotas valem na ordem em que são declaradas. */
export declare function controller(prefixo: string, rotas: Rota[]): RotaCompilada[];
export declare const rota: {
    get: (caminho: string, handler: Rota["handler"], opcoes?: Partial<Rota>) => Rota;
    post: (caminho: string, handler: Rota["handler"], opcoes?: Partial<Rota>) => Rota;
    patch: (caminho: string, handler: Rota["handler"], opcoes?: Partial<Rota>) => Rota;
    put: (caminho: string, handler: Rota["handler"], opcoes?: Partial<Rota>) => Rota;
    delete: (caminho: string, handler: Rota["handler"], opcoes?: Partial<Rota>) => Rota;
};
export declare function encontrarRota(rotas: RotaCompilada[], metodo: string, caminho: string): {
    rota: RotaCompilada;
    params: Record<string, string | undefined>;
} | null;
export declare function criarContexto(req: Request, params: Record<string, string | undefined>): Contexto;
/** Converte o retorno do handler em resposta HTTP, como o NestJS (Express) faz. */
export declare function montarResposta(resultado: unknown, status: number): Response;
export declare function respostaDeErro(erro: unknown): Response;
