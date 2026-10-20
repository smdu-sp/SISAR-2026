import { Cargo, Permissao, Unidade } from "@prisma/client";
export declare class UsuarioResponseDTO {
    id: string;
    nome: string;
    login: string;
    email: string;
    cargo: Cargo;
    permissao: Permissao;
    status: number;
    criado_em: Date;
    alterado_em: Date;
    unidade_id: string;
    unidade?: Unidade;
}
export declare class UsuarioPaginadoResponseDTO {
    total: number;
    pagina: number;
    limite: number;
    data?: UsuarioResponseDTO[];
}
export declare class BuscarNovoResponseDTO {
    login: string;
    nome: string;
    email: string;
    unidade_id: string;
}
export declare class BuscarFuncionariosResponseDTO {
    administrativos: UsuarioResponseDTO[];
    tecnicos: UsuarioResponseDTO[];
}
export declare class AddSubstitutoDTO {
    usuario_id: string;
    substituto_id: string;
}
export declare class UsuarioDesativadoResponseDTO {
    desativado: boolean;
}
export declare class UsuarioAutorizadoResponseDTO {
    autorizado: boolean;
}
