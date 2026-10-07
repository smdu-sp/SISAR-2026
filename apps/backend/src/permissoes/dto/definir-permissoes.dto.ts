import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class DefinirPermissoesDto {
  @ApiProperty({
    example: ['painel_inicial', 'relatorios'],
    description: 'Recursos que o perfil passa a poder acessar (substitui a lista atual).',
  })
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  recursos: string[];
}
