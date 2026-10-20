/** Tipos de relatório suportados pela exportação (PDF/Excel) e pelo envio por e-mail. */
export const TIPOS_RELATORIO = [
  'ar-quantitativo',
  'rr-quantitativo',
  'ar-progressao-mensal',
  'ar-gabinete-prefeito',
  'ar-analise-admissibilidade',
  'rr-analise-admissibilidade',
] as const;

export type TipoRelatorio = (typeof TIPOS_RELATORIO)[number];
