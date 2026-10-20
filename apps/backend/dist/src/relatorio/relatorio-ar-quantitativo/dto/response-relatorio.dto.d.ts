export declare class Data {
    nome: string;
    count: number;
}
export declare class Smul_Graproem {
    quantidade: number;
    data: Data[];
}
export declare class RelatorioData {
    smul: Smul_Graproem;
    graproem: Smul_Graproem;
    total_parcial: number;
}
export declare class RelatorioResopnseDto {
    total: number;
    analise: number;
    inadimissiveis: number;
    admissiveis: number;
    data_gerado: string;
    em_analise?: RelatorioData;
    deferidos?: RelatorioData;
    indeferidos?: RelatorioData;
}
export declare class PeriodFilterDto {
    gte: Date;
    lte: Date;
}
