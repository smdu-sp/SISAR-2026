/** @format */

export interface IRespostaApi<T> {
	ok: boolean;
	error: string | null;
	data: T | null;
	status: number;
}

/** Chamada JSON autenticada à API, com o mesmo formato de resposta dos demais serviços. */
export async function chamarApi<T>(
	caminho: string,
	token: string | undefined,
	init: { method?: string; body?: unknown } = {},
): Promise<IRespostaApi<T>> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${caminho}`, {
			method: init.method ?? 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: init.body === undefined ? undefined : JSON.stringify(init.body),
			cache: 'no-store',
		});
		const texto = await response.text();
		const dados = texto ? JSON.parse(texto) : null;
		if (response.ok) {
			return { ok: true, error: null, data: dados as T, status: response.status };
		}
		const mensagem = Array.isArray(dados?.message)
			? dados.message.join(' ')
			: dados?.message;
		return {
			ok: false,
			error:
				response.status === 403
					? 'Você não tem permissão para esta ação.'
					: (mensagem ?? 'Erro ao comunicar com o servidor.'),
			data: null,
			status: response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao comunicar com o servidor: ' + error, data: null, status: 500 };
	}
}
