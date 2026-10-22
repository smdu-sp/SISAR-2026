export interface ISubprefeitura {
    id: string;
    nome: string;
    sigla: string;
    status: number;
    criado_em: Date;
    alterado_em: Date;
}

export interface IPaginadoSubprefeituras {
    total: number;
    pagina: number;
    limite: number;
    data?: ISubprefeitura[];
}

export interface IRespostaSubprefeituras {
    ok: boolean;
    error: string | null;
    data:
    | ISubprefeitura
    | ISubprefeitura[]
    | IPaginadoSubprefeituras
    | null;
    status: number;
}