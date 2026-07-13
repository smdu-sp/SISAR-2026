/** @format */

export type VarianteBadge = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Status da admissibilidade (campo `Admissibilidade.status`).
 * 0 = admitido; 1 = em análise (estado inicial); 3 = inadmitido, com janela de
 * reconsideração aberta (setado pela ação "Inadmitir"); 2 = inadmissível
 * definitivo (setado pelo cron após o prazo de reconsideração expirar).
 */
export const STATUS_ADMISSIBILIDADE: Record<
	number,
	{ label: string; variant: VarianteBadge }
> = {
	0: { label: 'Admissível', variant: 'default' },
	1: { label: 'Em análise', variant: 'secondary' },
	2: { label: 'Inadmissível (definitivo)', variant: 'destructive' },
	3: { label: 'Inadmitido (em reconsideração)', variant: 'outline' },
};

export function statusAdmissibilidade(status?: number | null) {
	return STATUS_ADMISSIBILIDADE[status ?? 1] ?? STATUS_ADMISSIBILIDADE[1];
}
