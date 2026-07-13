import { ApiProperty } from '@nestjs/swagger';
import { IInterfaces } from './create-admissibilidade.dto';

export class AdmitirDto {
  @ApiProperty()
  unidade_id: string;
  @ApiProperty()
  subprefeitura_id: string;
  @ApiProperty()
  data_decisao_interlocutoria: Date;
  @ApiProperty()
  tipo_processo: number;
  @ApiProperty({ required: false })
  interfaces?: IInterfaces;
}

export class InadmitirDto {
  @ApiProperty()
  parecer_admissibilidade_id: string;
  @ApiProperty({ required: false })
  obs?: string;
}
