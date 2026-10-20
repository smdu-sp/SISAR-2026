
export class SubprefeituraResponseDTO {
    id: string
    nome: string
    sigla: string
    status: number
    criado_em: Date
    alterado_em: Date
}

export class CreateResponseSubprefeituraDTO {
    id: string
    nome: string
    sigla: string
    status: number
    criado_em: Date
    alterado_em: Date
}

export class SubprefeituraPaginatedResponseDTO {
    total: number
    pagina: number
    limite: number
    data?: Array<SubprefeituraResponseDTO>
}
