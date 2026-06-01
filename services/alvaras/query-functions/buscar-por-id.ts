/** @format */

import { IAlvaras, IRespostaAlvaras } from '@/types/alvaras';

export async function buscarPorId(
	id: string,
	access_token: string,
): Promise<IRespostaAlvaras> {
	if (!id) {
		return {
			ok: false,
			error: 'ID não informado.',
			data: null,
			status: 400,
		};
	}

	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}alvara-tipo/buscar-por-id/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['alvaras', `alvara-${id}`], revalidate: 120 },
		});

		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IAlvaras,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message,
			data: null,
			status: data.statusCode,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar o tipo de alvará: ' + error,
			data: null,
			status: 400,
		};
	}
}
