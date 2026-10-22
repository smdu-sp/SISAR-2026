/** @format */

import { IPaginadoProcessos, IRespostaProcessos } from '@/types/processos';

export async function buscarTudo(
	access_token: string,
	pagina: number = 1,
	limite: number = 10,
): Promise<IRespostaProcessos> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}inicial/buscar-tudo-analise?pagina=${pagina}&limite=${limite}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['analise'], revalidate: 120 },
			},
		);
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IPaginadoProcessos,
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
			error: 'Não foi possível buscar processos em análise: ' + error,
			data: null,
			status: 400,
		};
	}
}
