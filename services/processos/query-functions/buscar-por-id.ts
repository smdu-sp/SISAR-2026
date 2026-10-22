/** @format */

import { IProcesso, IRespostaProcessos } from '@/types/processos';

export async function buscarPorId(
	access_token: string,
	id: number,
): Promise<IRespostaProcessos> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}inicial/buscar-por-id/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: [`processo-${id}`], revalidate: 120 },
		});
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IProcesso,
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
			error: 'Não foi possível buscar o processo: ' + error,
			data: null,
			status: 400,
		};
	}
}
