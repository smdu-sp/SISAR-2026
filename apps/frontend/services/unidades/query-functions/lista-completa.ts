/** @format */

import { IRespostaUnidades, IUnidades, NivelUnidade } from '@/types/unidades';

export async function listaCompleta(
	access_token: string,
	nivel?: NivelUnidade,
): Promise<IRespostaUnidades> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const nivelParam = nivel ? `?nivel=${nivel}` : '';
	try {
		const response = await fetch(`${baseURL}unidades/lista-completa${nivelParam}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['unidades'], revalidate: 120 },
		});
		const data = await response.json();
		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IUnidades[],
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
			error: 'Não foi possível buscar a lista de unidades: ' + error,
			data: null,
			status: 500,
		};
	}
}
