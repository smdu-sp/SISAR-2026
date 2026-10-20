
export class DistribuicaoResponseDTO {
    inicial_id: number;
    tecnico_responsavel_id: string | null;
    administrativo_responsavel_id: string;
    processo_relacionado_incomum: string | null;
    assunto_processo_relacionado_incomum: string | null;
    baixa_pagamento: number;
    obs: string | null;
    criado_em: Date;
    alterado_em: Date;
}
