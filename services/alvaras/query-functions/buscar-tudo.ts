/** @format */

import { IPaginadoAlvaras, IRespostaAlvaras } from '@/types/alvaras';

export async function buscarTudo(
	access_token: string,
	pagina = 1,
	limite = 10,
	busca = '',
): Promise<IRespostaAlvaras> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const params = new URLSearchParams({
			pagina: String(pagina),
			limite: String(limite),
			busca,
		});
		const response = await fetch(
			`${baseURL}alvara-tipo/buscar-tudo?${params}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['alvaras'], revalidate: 120 },
			},
		);
		const data = await response.json();
		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IPaginadoAlvaras,
				status: 200,
			};
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar tipos de alvará',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar tipos de alvará: ' + error,
			data: null,
			status: 400,
		};
	}
}
