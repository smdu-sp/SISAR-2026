/** @format */

export async function buscarPorDataProcesso(access_token: string, data: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}inicial/buscar-data-processo/${data}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			cache: 'no-store',
		},
	);
	if (!response.ok) return [];
	return response.json();
}

export async function buscarPorMesAnoProcesso(
	access_token: string,
	mes: number,
	ano: number,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}inicial/buscar/${mes}/${ano}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-store',
	});
	if (!response.ok) return [];
	return response.json();
}

export async function buscaProcessosParaAvisos(access_token: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}inicial/busca-processos`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-store',
	});
	if (!response.ok) return [];
	return response.json();
}
