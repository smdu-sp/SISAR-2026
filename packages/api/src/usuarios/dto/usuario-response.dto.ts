import { Cargo, Permissao, Unidade } from "@prisma/client"

export class UsuarioResponseDTO {
    id: string
    nome: string
    login: string
    email: string
    cargo: Cargo
    permissao: Permissao
    status: number
    criado_em: Date
    alterado_em: Date
    unidade_id: string
    unidade?: Unidade
}

export class UsuarioPaginadoResponseDTO {
    total: number
    pagina: number
    limite: number
    data?: UsuarioResponseDTO[]
}

export class BuscarNovoResponseDTO {
    login: string
    nome: string
    email: string
    unidade_id: string
}

export class BuscarFuncionariosResponseDTO {
    administrativos: UsuarioResponseDTO[]
    tecnicos: UsuarioResponseDTO[]
}

export class AddSubstitutoDTO {
    usuario_id: string;
    substituto_id: string;
}

export class UsuarioDesativadoResponseDTO {
    desativado: boolean
}

export class UsuarioAutorizadoResponseDTO {
    autorizado: boolean
}
