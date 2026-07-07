import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePublicacaoDto {
  @IsString({ message: 'Número do processo inválido.' })
  @ApiProperty()
  numero_processo: string;

  @IsEnum($Enums.Tipo_Documento, {
    message: 'Escolha um tipo de documento válido.',
  })
  @ApiProperty()
  tipo_documento: $Enums.Tipo_Documento;

  @IsEnum($Enums.Colegiado, { message: 'Escolha um colegiado válido.' })
  @ApiProperty()
  colegiado: $Enums.Colegiado;

  @IsString({ message: 'Técnico inválido.' })
  @ApiProperty()
  tecnico_rf: string;

  @IsString({ message: 'Coordenadoria inválida.' })
  @ApiProperty()
  coordenadoria_id: string;

  @IsDate({ message: 'Data de emissão inválida.' })
  @ApiProperty()
  data_emissao: Date;

  @IsDate({ message: 'Data de publicação inválida.' })
  @ApiProperty()
  data_publicacao: Date;

  @IsNumber({}, { message: 'Prazo inválido.' })
  @ApiProperty()
  prazo: number;
}
