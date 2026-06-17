/** @format */

import {
	IAdmissibilidade,
	IPaginadoAdmissibilidade,
	IRespostaAdmissibilidade,
} from '@/types/admissibilidade';

export async function buscarTudo(
	access_token: string,
	pagina: number = 1,
	limite: number = 10,
	filtro: number = -1,
	busca: string = '',
): Promise<IRespostaAdmissibilidade> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const buscaLimpa = busca.replace(/[-./]/g, '');

	try {
		const params = new URLSearchParams({
			pagina: String(pagina),
			limite: String(limite),
			filtro: String(filtro),
		});
		if (buscaLimpa) params.set('busca', buscaLimpa);

		const response = await fetch(
			`${baseURL}admissibilidade/buscar-tudo?${params.toString()}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['admissibilidade'], revalidate: 120 },
			},
		);
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IPaginadoAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar admissibilidades',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar a lista de admissibilidades: ' + error,
			data: null,
			status: 400,
		};
	}
}

export async function buscarPorId(
	access_token: string,
	id: number,
): Promise<IRespostaAdmissibilidade> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}admissibilidade/buscar-id/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['admissibilidade'], revalidate: 120 },
		});
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar admissibilidade',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar a admissibilidade: ' + error,
			data: null,
			status: 400,
		};
	}
}
