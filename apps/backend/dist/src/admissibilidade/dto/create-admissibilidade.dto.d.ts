export declare class CreateAdmissibilidadeDto {
    inicial_id: number;
    unidade_id: string;
    data_envio: Date;
    data_decisao_interlocutoria: Date;
    parecer_admissibilidade_id?: string;
    subprefeitura_id: string;
    categoria_id: string;
    status?: number;
    interfaces?: IInterfaces;
    tipo_processo?: number;
}
export declare class IInterfaces {
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
