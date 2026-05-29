/** @format */

export async function atualizar(
	access_token: string,
	id: string,
	data: { titulo?: string; descricao?: string; data?: Date; inicial_id?: number },
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}avisos/atualizar/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) return null;
	return response.json();
}

export async function excluir(access_token: string, id: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}avisos/excluir/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	return response.ok;
}
