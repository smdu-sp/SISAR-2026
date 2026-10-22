import { IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  categoria: string;

  @IsString()
  descricao?: string;

  @IsString()
  divisao?: string;

  @IsString()
  competencia?: string;
}
