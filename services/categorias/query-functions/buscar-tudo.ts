/** @format */

import { IPaginadoCategorias, IRespostaCategoria } from '@/types/categorias';

export async function buscarTudo(
	access_token: string,
	pagina = 1,
	limite = 10,
	busca = '',
): Promise<IRespostaCategoria> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(
			`${baseURL}categorias/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(busca)}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['categorias'], revalidate: 120 },
			},
		);
		const data = await response.json();
		if (response.status === 200) {
			return { ok: true, error: null, data: data as IPaginadoCategorias, status: 200 };
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar categorias',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar categorias: ' + error,
			data: null,
			status: 400,
		};
	}
}
