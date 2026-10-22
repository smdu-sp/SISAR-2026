import { Permissao } from '@prisma/client';
export interface Recurso {
    chave: string;
    rotulo: string;
    grupo: string;
    descricao: string;
}
/** Recurso exigido por endpoints sem @Recurso explícito (telas e ações de processos). */
export declare const RECURSO_PADRAO = "processos";
/** Gestão das permissões: exclusiva do perfil DEV e não pode ser concedida nem removida. */
export declare const RECURSO_TRAVADO = "permissoes";
export declare const PERFIS: Permissao[];
export declare const RECURSOS: Recurso[];
export declare const CHAVES_RECURSOS: string[];
/** Padrão inicial (espelha o comportamento anterior à gestão de permissões). */
export declare const PERMISSOES_PADRAO: Record<Permissao, string[]>;
