import { IsString } from 'class-validator';

export class CreateMotivoInadmissaoDto {
  @IsString()
  descricao: string;
}
