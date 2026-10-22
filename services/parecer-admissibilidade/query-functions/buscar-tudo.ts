/** @format */

import {
	IPaginadoParecerAdmissibilidade,
	IRespostaParecerAdmissibilidade,
} from '@/types/parecer-admissibilidade';

export async function buscarTudo(
	access_token: string,
	pagina: number = 1,
	limite: number = 100,
	busca: string = '',
): Promise<IRespostaParecerAdmissibilidade> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}parecer-admissibilidade/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(busca)}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['parecer-admissibilidade'], revalidate: 120 },
			},
		);
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IPaginadoParecerAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar pareceres',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar pareceres: ' + error,
			data: null,
			status: 400,
		};
	}
}
