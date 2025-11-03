export interface IRelatorioStatusResumoQuantitativo {
    total: number;
    analise: number;
    inadmissiveis: number;
    admissiveis: number;
    data_gerado: string;

    em_analise: IStatusDetalhe;
    deferidos: IStatusDetalhe;
    indeferidos: IStatusDetalhe;

    analise_admissiveis_dados: IAdmissibilidadeDetalhe[];
    inadmissiveis_dados: IAdmissibilidadeDetalhe[];
    em_analise_dados: IAdmissibilidadeDetalhe[];
    deferidos_dados: IAdmissibilidadeDetalhe[];
    indeferidos_dados: IAdmissibilidadeDetalhe[];
    via_ordinaria_dados: IAdmissibilidadeDetalhe[];
}

export interface IStatusDetalhe {
    smul: IOrgaoDetalhe;
    graproem: IOrgaoDetalhe;
    parhis: IOrgaoDetalhe;
    servin: IOrgaoDetalhe;
    comin: IOrgaoDetalhe;
    caepp: IOrgaoDetalhe;
    resid: IOrgaoDetalhe;
    total_parcial: number;
}


export interface IOrgaoDetalhe {
    quantidade: number;
    data: { [key: string]: number };
}


export interface IAdmissibilidadeDetalhe {
    id: number;
    decreto: boolean;
    sei: string;
    tipo_requerimento: number;
    requerimento: string;
    aprova_digital: string;
    processo_fisico: string;
    data_protocolo: string;
    envio_admissibilidade: string;
    alvara_tipo_id: string;
    tipo_processo: number;
    obs: string;
    status: number;
    pagamento: number;
    requalifica_rapido: boolean;
    associado_reforma: boolean;
    data_limiteSmul: string;
    data_limiteMulti: string | null;
    criado_em: string;
    alterado_em: string;
}

export interface IRelatorioARProgressaoMensal {
    ano: number;
    mes: number[];
    acc: number[];
}

export interface IListaARProgressaoMensal {
    ano: number,
    mes: string,
    mensal: number,
    acc: number
}

export interface IRelatorioFiltrosState {
    tipoRelatorio: string | null;
    extensaoArquivo: string | null;
    periodoString: string | null;
    dataInicial: Date | string | null;
    dataFinal: Date | string | null;
    anoInicial: string | null | Date;
    anoFinal: string | null | Date;
}

export interface IAdmissibilidadesAnalise {
    id: number;
    decreto: boolean;
    sei: string;
    tipo_requerimento: number;
    requerimento: string;
    aprova_digital: string;
    processo_fisico: string;
    data_protocolo: string; // ISO string
    envio_admissibilidade: string | number | Date;
    alvara_tipo_id: string;
    tipo_processo: number;
    obs: string;
    status: number;
    pagamento: number;
    requalifica_rapido: boolean;
    associado_reforma: boolean;
    data_limiteSmul: string | null;
    data_limiteMulti: string | null;
    criado_em: string; // ISO string
    alterado_em: string; // ISO string
    autor_projeto_id: string | null;
    responsavel_tecnico_id: string | null;
    proprietario_id: string | null;
    area: string | null;
    resumo_projeto: string | null;
    zona: string;
    data_requalificacao: string | null;
    reconsiderado: boolean;
    suspensao_prazo: number | null;
    suspensao_prazo_etapa_1: number | null;
    suspensao_prazo_etapa_2: number | null;
    tempo_de_analise_admissibilidade: number | null;
    tempo_de_analise_reconsideracao: number | null;
    motivos_suspensao?: string[] | null;
    ano: number;
    mes: string;
}

export type Meses =
    | "jan."
    | "fev."
    | "mar."
    | "abr."
    | "mai."
    | "jun."
    | "jul."
    | "ago."
    | "set."
    | "out."
    | "nov."
    | "dez.";

type RelatorioPorMeses = Partial<Record<Meses, IAdmissibilidadesAnalise[]>>;

export interface IRelatorioPrazoAnaliseAdmissibilidade {
    [ano: string]: RelatorioPorMeses;
}

export interface IRelatorioPrazoAnaliseRetorno {
    cabecalho: {
        prazoFixoAnalise: string;
        dataInicio: string;
        dataFim: string;
        qtdAnaliseFinalizada: string;
        qtdAnaliseNoPrazo: string;
        qtdAnaliseExcedido: string;
        mediaPeriodoAnalise: string;
        mediaPeriodoReconsideracao: string;
    };
    dados: {
        [ano: string]: RelatorioPorMeses;
    };
}

export interface ICabecalhoRelatorioPrazoAnaliseAdmissibilidade {
    prazoFixoAnalise: string;
    dataInicio: string;
    dataFim: string;
    qtdAnaliseFinalizada: string;
    qtdAnaliseNoPrazo: string;
    qtdAnaliseExcedido: string;
    mediaPeriodoAnalise: string;
    mediaPeriodoReconsideracao: string;
}

export interface IRelatorioPrazoAnaliseAdmissibilidadeRR {
    id: number;
    decreto: boolean;
    sei: string;
    tipo_requerimento: number;
    requerimento: string;
    aprova_digital: string;
    processo_fisico: string;
    data_protocolo: string | Date;
    envio_admissibilidade: string | Date;
    alvara_tipo_id: string;
    tipo_processo: number;
    obs: string;
    status: number;
    pagamento: number;
    requalifica_rapido: boolean;
    associado_reforma: boolean;
    data_limiteSmul: string | Date;
    data_limiteMulti: string | Date | null;
    criado_em: string | Date;
    alterado_em: string | Date;
    autor_projeto_id: string | null;
    responsavel_tecnico_id: string | null;
    proprietario_id: string | null;
    area: string | null;
    resumo_projeto: string | null;
    zona: string;
    data_requalificacao: string | Date;
    suspensao_prazo: string | Date | null;
    suspensao_prazo_etapa_1: string | Date | null;
    suspensao_prazo_etapa_2: string | Date | null;
    tempo_de_analise_reconsideracao: number;
    tempo_de_analise_admissibilidade: number | null;
}


// interfaces/relatorios.ts

export interface IProcessoGabinetePrefeito {
    id: number;
    decreto: boolean;
    sei: string;
    tipo_requerimento: number;
    requerimento: string;
    aprova_digital: string;
    processo_fisico: string;
    data_protocolo: string;
    envio_admissibilidade: string | null;
    alvara_tipo_id: string;
    tipo_processo: number;
    obs: string;
    status: number;
    pagamento: number;
    requalifica_rapido: boolean;
    associado_reforma: boolean;
    data_limiteSmul: string;
    data_limiteMulti: string | null;
    criado_em: string;
    alterado_em: string;
    autor_projeto_id: string | null;
    responsavel_tecnico_id: string | null;
    proprietario_id: string | null;
    area: string | null;
    resumo_projeto: string | null;
    zona: string;
    numero_do_processo: string;
    tempo_de_analise_pedido_inicial: number;
    tempo_de_analise_recurso?: number;
}

export interface IRelatorioGabinetePrefeitoAno {
    ano: number;
    dados: IProcessoGabinetePrefeito[];
    "dez.": IProcessoGabinetePrefeito[];
    "jan.": IProcessoGabinetePrefeito[];
    "fev.": IProcessoGabinetePrefeito[];
    "mar.": IProcessoGabinetePrefeito[];
    "abr.": IProcessoGabinetePrefeito[];
    "mai.": IProcessoGabinetePrefeito[];
    "jun.": IProcessoGabinetePrefeito[];
    "jul.": IProcessoGabinetePrefeito[];
    "ago.": IProcessoGabinetePrefeito[];
    "set.": IProcessoGabinetePrefeito[];
    "out.": IProcessoGabinetePrefeito[];
    "nov.": IProcessoGabinetePrefeito[];
    numeros_de_processos: IProcessoGabinetePrefeito[];
    processos_protocolados: number;
    processos_aprovados: number;
}

export type IRelatorioGabinetePrefeito = IRelatorioGabinetePrefeitoAno[];