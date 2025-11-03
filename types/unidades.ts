export const Unidades = {
    CODIGO: 'Código',
    SIGLA: 'Sigla',
    NOME: 'Nome',
}

export interface IUnidades {
    codigo: string,
    sigla: string,
    nome: string,
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