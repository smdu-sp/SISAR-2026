/** @format */

export async function atualizarData(
	access_token: string,
	id: string,
	nova_data_reuniao: Date,
	justificativa_remarcacao: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}reunioes/atualizar-data/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify({ nova_data_reuniao, justificativa_remarcacao }),
	});
	if (!response.ok) return null;
	return response.json();
}
