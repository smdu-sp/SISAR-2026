/** Tipos de relatório suportados pela exportação (PDF/Excel) e pelo envio por e-mail. */
export declare const TIPOS_RELATORIO: readonly ["ar-quantitativo", "rr-quantitativo", "ar-progressao-mensal", "ar-gabinete-prefeito", "ar-analise-admissibilidade", "rr-analise-admissibilidade"];
export type TipoRelatorio = (typeof TIPOS_RELATORIO)[number];
