/** @format */

/** Aba sugerida ao abrir o processo conforme a fase atual. */
export function abaInicialProcesso(status?: number): string | undefined {
	switch (status) {
		case 0:
			return 'admissibilidade';
		case 2:
			return 'analise';
		case 3:
			return 'finalizacao';
		case 4:
			return 'analise';
		default:
			return undefined;
	}
}

export function urlProcesso(id: number, status?: number): string {
	const tab = abaInicialProcesso(status);
	return tab ? `/processos/${id}?tab=${tab}` : `/processos/${id}`;
}
