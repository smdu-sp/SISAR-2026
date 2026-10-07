/** @format */

/**
 * Recursos (telas/ações) que o perfil do usuário logado pode acessar.
 * Usa apenas `fetch`, então funciona em middleware (edge) e no servidor.
 * Retorna null se não for possível consultar (o backend continua validando).
 */
export async function buscarMeusRecursos(
	accessToken?: string,
): Promise<string[] | null> {
	if (!accessToken) return null;
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}permissoes/meus-recursos`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				cache: 'no-store',
			},
		);
		if (!response.ok) return null;
		const data = (await response.json()) as { recursos?: string[] };
		return Array.isArray(data.recursos) ? data.recursos : null;
	} catch {
		return null;
	}
}
