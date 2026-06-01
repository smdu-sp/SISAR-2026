/** @format */

import { IConclusao, IRespostaFinalizacao } from '@/types/finalizacao';

export async function buscarPorInicial(
	access_token: string,
	inicialId: number,
): Promise<IRespostaFinalizacao> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}finalizacao/buscar/${inicialId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				cache: 'no-store',
			},
		);

		if (response.status === 200) {
			const data = await response.json();
			return {
				ok: true,
				error: null,
				data: data as IConclusao,
				status: 200,
			};
		}

		return {
			ok: false,
			error: null,
			data: null,
			status: response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar finalização: ' + error,
			data: null,
			status: 400,
		};
	}
}
