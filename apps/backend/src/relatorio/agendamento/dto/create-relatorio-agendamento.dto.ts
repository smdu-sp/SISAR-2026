import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Quantitativo mensal AR - Gabinete' })
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ enum: TIPOS_RELATORIO })
  @IsIn(TIPOS_RELATORIO, { message: 'Tipo de relatório inválido.' })
  tipo_relatorio: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  formato_pdf?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  formato_excel?: boolean;

  @ApiProperty({ example: ['a@dominio.gov.br', 'b@dominio.gov.br'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true, message: 'E-mail de destinatário inválido.' })
  destinatarios: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(191)
  assunto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mensagem?: string;

  @ApiProperty({ enum: Frequencia_Envio, default: Frequencia_Envio.MENSAL })
  @IsEnum(Frequencia_Envio)
  frequencia: Frequencia_Envio;

  @ApiPropertyOptional({ example: 5, description: 'Obrigatório na frequência MENSAL (1-31).' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dia_do_mes?: number;

  @ApiPropertyOptional({ example: 1, description: 'Obrigatório na frequência SEMANAL (0=domingo ... 6=sábado).' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dia_da_semana?: number;

  @ApiPropertyOptional({ default: 8, description: 'Hora do envio (horário de Brasília).' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  hora?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  minuto?: number;

  @ApiPropertyOptional({ enum: Periodo_Relatorio, default: Periodo_Relatorio.MES_ANTERIOR })
  @IsOptional()
  @IsEnum(Periodo_Relatorio)
  periodo?: Periodo_Relatorio;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
