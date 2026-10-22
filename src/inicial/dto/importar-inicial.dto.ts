
export type StatusLinhaImportacao = 'criado' | 'duplicado' | 'erro';

export class DetalheLinhaImportacaoDTO {
  linha: number;
  sei: string;
  status: StatusLinhaImportacao;
  mensagem?: string;
}

export class ImportarInicialResponseDTO {
  total: number;
  criados: number;
  duplicados: number;
  erros: number;
  detalhes: DetalheLinhaImportacaoDTO[];
}
