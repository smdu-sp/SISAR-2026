import { Admissibilidade, Alvara_Tipo, Avisos, Comunique_se, Conclusao, Controle_Prazo, Decisao, Distribuicao, Inicial, Inicial_Sqls, Interface, Motivo_Inadmissao_Inicial, Pedido_Inicial, Reconsideracao_Admissibilidade, Reuniao_Processo, Suspensao_Prazo } from "@prisma/client";

export class FinalizacaoPaginado {
    data: FinalizacaoResponseDTO[];
    total: number;
    pagina: number;
    limite: number;
}

export class InicialResponseDTO {
    id: number
    decreto: boolean
    sei: string
    tipo_requerimento: number
    requerimento: string
    aprova_digital?: string
    processo_fisico?: string
    data_protocolo: Date
    envio_admissibilidade?: Date
    alvara_tipo?: Alvara_Tipo
    alvara_tipo_id: string
    tipo_processo?: number
    obs?: string
    status?: number
    pagamento?: number
    requalifica_rapido?: boolean
    associado_reforma?: boolean
    data_limiteSmul?: Date
    data_limiteMulti?: Date
    comunique_ses?: Comunique_se[]
    controles_prazo?: Controle_Prazo[]
    decisoes?: Decisao[]
    motivos_inadmissao?: Motivo_Inadmissao_Inicial[]
    pedidos?: Pedido_Inicial[]
    reunioes?: Reuniao_Processo[]
    suspensoes_prazo?: Suspensao_Prazo[]
    iniciais_sqls?: Inicial_Sqls[]
    avisos?: Avisos[]
    admissibilidade?: Admissibilidade
    conclusao?: Conclusao
    distribuicao?: Distribuicao
    reconsideracao_admissibilidade?: Reconsideracao_Admissibilidade
    interfaces?: Interface
    criado_em?: Date
    alterado_em?: Date
}

export class FinalizacaoResponseDTO {
    inicial: InicialResponseDTO
    data_apostilamento: Date
    data_conclusao: Date
    data_emissao: Date
    data_outorga: Date
    data_resposta: Date
    data_termo: Date
    num_alvara: string
    obs: string
    outorga: boolean
}
