import { Admissibilidade } from "@prisma/client";

export class CreateResponseAdmissibilidadeDTO {
    inicial_id: number;
    unidade_id: string;
    data_envio: Date;
    data_decisao_interlocutoria: Date;
    parecer_admissibilidade_id: string;
    subprefeitura_id: string;
    categoria_id: string;
    status: number;
    reconsiderado: boolean;
    motivo: number;
    obs?: string;
    criado_em: Date;
    alterado_em: Date;
}

export class AdmissibilidadeResponseDTO {
    inicial_id: number;
    unidade_id: string;
    data_envio: Date;
    data_decisao_interlocutoria: Date;
    parecer_admissibilidade_id: string;
    subprefeitura_id: string;
    categoria_id: string;
    status: number;
    reconsiderado: boolean;
    motivo: number;
    obs: string;
    criado_em: Date;
    alterado_em: Date;
}

export class AdmissibilidadePaginado {
    data: Admissibilidade[];
    total: number;
    pagina: number;
    limite: number;
}
