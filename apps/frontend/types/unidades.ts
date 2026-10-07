export const Unidades = {
    CODIGO: 'Código',
    SIGLA: 'Sigla',
    NOME: 'Nome',
}

export type NivelUnidade = 'COORDENADORIA' | 'DIRETORIA' | 'UNIDADE';

export const NIVEL_LABEL: Record<NivelUnidade, string> = {
    COORDENADORIA: 'Coordenadoria',
    DIRETORIA: 'Diretoria',
    UNIDADE: 'Unidade',
};

export interface IUnidades {
    id: string;
    codigo: string;
    sigla: string;
    nome: string;
    status: number;
    nivel: NivelUnidade;
    unidade_pai_id: string | null;
    unidade_pai?: { id: string; nome: string; sigla: string | null; nivel: NivelUnidade } | null;
}

/** Nó da árvore hierárquica de unidades. */
export interface IUnidadeArvore extends IUnidades {
    filhas: IUnidadeArvore[];
}

export interface IPaginadoUnidades {
    data: IUnidades[];
    total: number;
    pagina: number;
    limite: number;
}

export interface IRespostaUnidades {
    ok: boolean;
    error: string | null;
    data:
    | IUnidades
    | IUnidades[]
    | IPaginadoUnidades
    | IUnidadeArvore[]
    | null;
    status: number;
}
