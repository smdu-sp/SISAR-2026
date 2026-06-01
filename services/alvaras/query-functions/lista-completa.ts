/** @format */

import { IAlvaras, IRespostaAlvaras } from '@/types/alvaras';

export async function listaCompleta(
	access_token: string,
): Promise<IRespostaAlvaras> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}alvara-tipo/lista-completa`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['alvaras'], revalidate: 300 },
		});
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IAlvaras[],
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
			error: 'Não foi possível listar tipos de alvará: ' + error,
			data: null,
			status: 400,
		};
	}
}
