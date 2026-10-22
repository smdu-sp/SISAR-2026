import type { RotaCompilada } from './http/tipos';
export declare const rotasApi: RotaCompilada[];
export declare function tratarRequisicao(req: Request, segmentos: string[]): Promise<Response>;
