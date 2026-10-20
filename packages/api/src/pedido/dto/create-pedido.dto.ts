import { IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  descricao: string;
}
