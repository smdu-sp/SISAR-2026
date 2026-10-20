type AlvaraPrazosMulti = {
    prazo_analise_multi1: number;
    prazo_analise_multi2: number;
    prazo_admissibilidade_multi: number;
    prazo_emissao_alvara_multi: number;
};
export declare function pegaQuartaAnterior(data: Date): Date;
export declare function prazoAnaliseInstancia(instancia: number, alvara: AlvaraPrazosMulti): number;
export declare function calcularDatasReuniaoGraproem(envioAdmissibilidade: Date, alvara: AlvaraPrazosMulti, instancia?: number): {
    data_reuniao: Date;
    data_processo: Date;
};
export {};
