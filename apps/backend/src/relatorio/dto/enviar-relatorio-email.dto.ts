import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EnviarRelatorioEmailDto {
  @ApiProperty({
    example: ['usuario@dominio.gov.br'],
    description: 'Lista de destinatarios do email.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  destinatarios: string[];

  @ApiPropertyOptional({
    example: 'Relatorio SISAR',
    description: 'Assunto do email. Se omitido, um assunto padrao sera usado.',
  })
  @IsOptional()
  @IsString()
  assunto?: string;

  @ApiPropertyOptional({
    example: 'Segue relatorio em anexo.',
    description: 'Mensagem do corpo do email.',
  })
  @IsOptional()
  @IsString()
  mensagem?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsString()
  dataInicial?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsString()
  dataFinal?: string;

  @ApiPropertyOptional({ example: '2024' })
  @IsOptional()
  @IsString()
  anoInicial?: string;

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  anoFinal?: string;

  @ApiPropertyOptional({ example: '2026-06' })
  @IsOptional()
  @IsString()
  periodo?: string;
}
