export type StatusLinhaImportacao = 'criado' | 'duplicado' | 'erro';
export declare class DetalheLinhaImportacaoDTO {
    linha: number;
    sei: string;
    status: StatusLinhaImportacao;
    mensagem?: string;
}
export declare class ImportarInicialResponseDTO {
    total: number;
    criados: number;
    duplicados: number;
    erros: number;
    detalhes: DetalheLinhaImportacaoDTO[];
}
