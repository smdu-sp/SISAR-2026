/** @format */

import { IRespostaSubprefeituras, ISubprefeitura } from '@/types/subprefeituras';

export async function listaCompleta(
	access_token: string,
): Promise<IRespostaSubprefeituras> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}subprefeitura/lista-completa`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['subprefeituras'], revalidate: 120 },
		});
		const data = await response.json();
		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as ISubprefeitura[],
				status: 200,
			};
		}
		return {
			ok: false,
			error: data.message,
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar a lista de subprefeituras: ' + error,
			data: null,
			status: 500,
		};
	}
}
