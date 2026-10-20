export declare class CreateInicialDto {
    id?: number;
    decreto: boolean;
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
    requalifica_rapido: boolean;
    associado_reforma: boolean;
    nums_sql?: string[];
    interfaces?: any;
    data_limiteSmul?: Date;
}
export declare class CreateInterfacesDto {
    inicial_id?: number;
    interface_sehab?: boolean;
    interface_siurb?: boolean;
    interface_smc?: boolean;
    interface_smt?: boolean;
    interface_svma?: boolean;
    num_sehab?: string;
    num_siurb?: string;
    num_smc?: string;
    num_smt?: string;
    num_svma?: string;
}
