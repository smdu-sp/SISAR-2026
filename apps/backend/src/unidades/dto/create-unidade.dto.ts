import { ApiProperty } from "@nestjs/swagger";
import { Nivel_Unidade } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateUnidadeDto {
    @ApiProperty()
    @IsString({ message: 'Nome inválido!' })
    nome: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ message: 'Sigla inválida!' })
    sigla?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ message: 'Código inválido!' })
    codigo?: string;

    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @IsInt({ message: 'Status inválido!' })
    status?: number;

    @ApiProperty({ enum: Nivel_Unidade, default: Nivel_Unidade.UNIDADE })
    @IsEnum(Nivel_Unidade, { message: 'Nível inválido!' })
    nivel: Nivel_Unidade;

    @ApiProperty({ required: false, description: 'Id da unidade pai (hierarquia).' })
    @IsOptional()
    @IsString({ message: 'Unidade pai inválida!' })
    unidade_pai_id?: string;
}
