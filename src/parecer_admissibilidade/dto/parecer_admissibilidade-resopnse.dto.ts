
export class ParecerAdmissibilidadeResponseDTO {
    id: string;
    parecer: string;
    status: number;
    criado_em: Date;
    alterado_em: Date;
}

export class ParecerAdmissibilidadePaginadoDTO {
    total: number;
    pagina: number;
    limite: number;
    data?: ParecerAdmissibilidadeResponseDTO[]
}
