import { Nivel_Unidade } from "@prisma/client";
export declare class UnidadeResponseDTO {
    id: string;
    nome: string;
    sigla: string;
    codigo: string;
    status: number;
    nivel: Nivel_Unidade;
    unidade_pai_id: string;
}
