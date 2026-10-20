import { $Enums } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePublicacaoDto {
  @IsString({ message: 'Número do processo inválido.' })
  numero_processo: string;

  @IsEnum($Enums.Tipo_Documento, {
    message: 'Escolha um tipo de documento válido.',
  })
  tipo_documento: $Enums.Tipo_Documento;

  @IsEnum($Enums.Colegiado, { message: 'Escolha um colegiado válido.' })
  colegiado: $Enums.Colegiado;

  @IsString({ message: 'Técnico inválido.' })
  tecnico_rf: string;

  @IsString({ message: 'Unidade inválida.' })
  unidade_id: string;

  @IsDate({ message: 'Data de emissão inválida.' })
  data_emissao: Date;

  @IsDate({ message: 'Data de publicação inválida.' })
  data_publicacao: Date;

  @IsNumber({}, { message: 'Prazo inválido.' })
  prazo: number;
}
