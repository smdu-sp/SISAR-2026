/** @format */

export interface ICreateAviso {
	titulo: string;
	descricao: string;
	data: Date;
	inicial_id: number;
	tipo: number;
}

export async function criar(access_token: string, data: ICreateAviso) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}avisos/criar`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) return null;
	return response.json();
}
