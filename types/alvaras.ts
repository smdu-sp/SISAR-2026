export interface IAlvaras {
    id: string;
    nome: string;
    prazo_admissibilidade_smul: number;
    reconsideracao_smul: number;
    reconsideracao_smul_tipo: number;
    analise_reconsideracao_smul: number;
    prazo_analise_smul1: number;
    prazo_analise_smul2: number;
    prazo_emissao_alvara_smul: number;
    prazo_admissibilidade_multi: number;
    reconsideracao_multi: number;
    reconsideracao_multi_tipo: number;
    analise_reconsideracao_multi: number;
    prazo_analise_mult1: number;
    prazo_analise_multi2: number;
    prazo_emissao_alvara_multi: number;
    prazo_comunique_se: number;
    prazo_encaminhar_coord: number;
    status: number;
    criado_em: Date | string;
    alterado_em: Date | string;
}

export interface IPaginadoAlvaras {
    total: number;
    pagina: number;
    limite: number;
    data?: IAlvarasTipos[];
}

export interface IRespostaAlvaras {
    ok: boolean;
    error: string | null;
    data:
    | IAlvaras
    | IAlvarasTipos
    | IAlvarasTipos[]
    | IAlvaras[]
    | IPaginadoAlvaras
    | null;
    status: number;
}

export interface IAlvarasTipos {
    nome: string;
    analise1: number;
    analise2: number;
    analiseMult1: number;
    analiseMult2: number;
}