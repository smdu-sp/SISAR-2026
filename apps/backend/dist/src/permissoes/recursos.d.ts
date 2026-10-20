import { Permissao } from '@prisma/client';
export interface Recurso {
    chave: string;
    rotulo: string;
    grupo: string;
    descricao: string;
}
export declare const RECURSO_PADRAO = "processos";
export declare const RECURSO_TRAVADO = "permissoes";
export declare const PERFIS: Permissao[];
export declare const RECURSOS: Recurso[];
export declare const CHAVES_RECURSOS: string[];
export declare const PERMISSOES_PADRAO: Record<Permissao, string[]>;
