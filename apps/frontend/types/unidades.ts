export const Unidades = {
    CODIGO: 'Código',
    SIGLA: 'Sigla',
    NOME: 'Nome',
}

export interface IUnidades {
    id: string;
    codigo: string;
    sigla: string;
    nome: string;
    status: number;
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
    | null;
    status: number;
}