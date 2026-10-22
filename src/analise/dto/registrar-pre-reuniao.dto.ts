
export class RegistrarPreReuniaoDto {
  data_reuniao: Date | string;

  data_processo: Date | string;

  numero_reuniao: string;

  parecer_grupo?: string;

  nova_data_reuniao?: Date | string;

  justificativa_remarcacao?: string;
}
