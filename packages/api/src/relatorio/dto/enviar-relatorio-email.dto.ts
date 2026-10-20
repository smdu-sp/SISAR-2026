import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class EnviarRelatorioEmailDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  destinatarios: string[];

  @IsOptional()
  @IsString()
  assunto?: string;

  @IsOptional()
  @IsString()
  mensagem?: string;

  @IsOptional()
  @IsString()
  dataInicial?: string;

  @IsOptional()
  @IsString()
  dataFinal?: string;

  @IsOptional()
  @IsString()
  anoInicial?: string;

  @IsOptional()
  @IsString()
  anoFinal?: string;

  @IsOptional()
  @IsString()
  periodo?: string;
}
