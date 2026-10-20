import { $Enums } from '@prisma/client';
export declare class CreateUsuarioDto {
    nome: string;
    login: string;
    email: string;
    unidade_id?: string;
    permissao?: $Enums.Permissao;
    cargo?: $Enums.Cargo;
    status?: number;
}
export declare class AddFeriasDto {
    inicio: Date;
    final: Date;
}
