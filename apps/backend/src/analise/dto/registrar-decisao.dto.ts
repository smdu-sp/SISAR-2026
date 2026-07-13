import { ApiProperty } from '@nestjs/swagger';

export class RegistrarDecisaoDto {
  @ApiProperty({ description: '1=deferir, 2=indeferir, 3=comunique-se' })
  parecer: number;

  @ApiProperty({ required: false })
  obs?: string;

  @ApiProperty({ required: false, description: 'Parecer técnico da decisão.' })
  parecer_tecnico?: string;
}
