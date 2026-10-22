export declare class SubprefeituraResponseDTO {
    id: string;
    nome: string;
    sigla: string;
    status: number;
    criado_em: Date;
    alterado_em: Date;
}
export declare class CreateResponseSubprefeituraDTO {
    id: string;
    nome: string;
    sigla: string;
    status: number;
    criado_em: Date;
    alterado_em: Date;
}
export declare class SubprefeituraPaginatedResponseDTO {
    total: number;
    pagina: number;
    limite: number;
    data?: Array<SubprefeituraResponseDTO>;
}
