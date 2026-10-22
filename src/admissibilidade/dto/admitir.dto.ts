import { IInterfaces } from './create-admissibilidade.dto';

export class AdmitirDto {
  unidade_id: string;
  subprefeitura_id: string;
  data_decisao_interlocutoria: Date;
  tipo_processo: number;
  interfaces?: IInterfaces;
}

export class InadmitirDto {
  parecer_admissibilidade_id: string;
  obs?: string;
}
