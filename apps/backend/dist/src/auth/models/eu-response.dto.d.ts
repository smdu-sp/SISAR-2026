import { Cargo, Ferias, Permissao, Substituto, Usuario } from "@prisma/client";
export declare class EuResponseDTO {
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
    ferias: Ferias[];
    substitutos: Substituto[];
    usuarios: Usuario[];
}
