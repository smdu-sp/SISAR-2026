/** @format */

export async function buscarPorMesAno(
	access_token: string,
	mes: number,
	ano: number,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}avisos/buscar/${mes}/${ano}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-store',
	});
	if (!response.ok) return [];
	return response.json();
}

export async function buscarPorData(access_token: string, data: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}avisos/buscar/${data}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-store',
	});
	if (!response.ok) return [];
	return response.json();
}
