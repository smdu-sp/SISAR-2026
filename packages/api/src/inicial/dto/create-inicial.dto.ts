
export class CreateInicialDto {
    id?: number;
    decreto: boolean = false;
    sei: string;
    tipo_requerimento: number;
    requerimento: string;
    aprova_digital: string;
    processo_fisico: string;
    data_protocolo: Date;
    envio_admissibilidade: Date;
    alvara_tipo_id: string;
    tipo_processo: number;
    etapa_analise?: number;
    substatus_analise?: number;
    obs?: string;
    status?: number;
    requalifica_rapido: boolean = false;
    associado_reforma: boolean = false;
    nums_sql?: string[];
    interfaces?: any;
    data_limiteSmul?: Date;
}

export class CreateInterfacesDto {
  inicial_id?: number;
  interface_sehab?: boolean = false;
  interface_siurb?: boolean = false;
  interface_smc?: boolean = false;
  interface_smt?: boolean = false;
  interface_svma?: boolean = false;
  num_sehab?: string;
  num_siurb?: string;
  num_smc?: string;
  num_smt?: string;
  num_svma?: string;
}
