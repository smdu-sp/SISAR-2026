/** Substatus durante análise técnica (status inicial = 2) */
export declare const SubstatusAnalise: {
    readonly NORMAL: 0;
    readonly COMUNIQUE_SE: 1;
    readonly AGUARDANDO_RECURSO: 2;
    readonly PRE_REUNIAO_GRAPROEM: 3;
};
/** Parecer da decisão técnica na instância atual */
export declare const ParecerDecisao: {
    readonly PENDENTE: 0;
    readonly DEFERIDO: 1;
    readonly INDEFERIDO: 2;
    readonly COMUNIQUE_SE: 3;
};
export declare const MAX_INSTANCIA_ANALISE = 3;
export declare const MotivoSuspensao: {
    readonly COMUNIQUE_SE: 1;
};
