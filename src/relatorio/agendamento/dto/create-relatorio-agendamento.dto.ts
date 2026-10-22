import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TIPOS_RELATORIO } from '../../relatorio.constants';

export class CreateRelatorioAgendamentoDto {
  @IsString()
  @MaxLength(150)
  nome: string;

  @IsIn(TIPOS_RELATORIO, { message: 'Tipo de relatório inválido.' })
  tipo_relatorio: string;

  @IsOptional()
  @IsBoolean()
  formato_pdf?: boolean;

  @IsOptional()
  @IsBoolean()
  formato_excel?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true, message: 'E-mail de destinatário inválido.' })
  destinatarios: string[];

  @IsOptional()
  @IsString()
  @MaxLength(191)
  assunto?: string;

  @IsOptional()
  @IsString()
  mensagem?: string;

  @IsEnum(Frequencia_Envio)
  frequencia: Frequencia_Envio;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dia_do_mes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dia_da_semana?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  hora?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minuto?: number;

  @IsOptional()
  @IsEnum(Periodo_Relatorio)
  periodo?: Periodo_Relatorio;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
