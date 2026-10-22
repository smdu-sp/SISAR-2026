import { Nivel_Unidade } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateUnidadeDto {
    @IsString({ message: 'Nome inválido!' })
    nome: string;

    @IsOptional()
    @IsString({ message: 'Sigla inválida!' })
    sigla?: string;

    @IsOptional()
    @IsString({ message: 'Código inválido!' })
    codigo?: string;

    @IsOptional()
    @IsInt({ message: 'Status inválido!' })
    status?: number;

    @IsEnum(Nivel_Unidade, { message: 'Nível inválido!' })
    nivel: Nivel_Unidade;

    @IsOptional()
    @IsString({ message: 'Unidade pai inválida!' })
    unidade_pai_id?: string;
}
