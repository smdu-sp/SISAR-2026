/** @format */

import { IPaginadoDiretorias, IRespostaDiretoria } from '@/types/diretorias';

export async function buscarTudo(
	access_token: string,
	pagina = 1,
	limite = 10,
	busca = '',
	coordenadoria_id = '',
): Promise<IRespostaDiretoria> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const filtroCoord = coordenadoria_id && coordenadoria_id !== 'all'
		? `&coordenadoria_id=${coordenadoria_id}`
		: '';
	try {
		const response = await fetch(
			`${baseURL}diretorias/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(busca)}${filtroCoord}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['diretorias'], revalidate: 120 },
			},
		);
		const data = await response.json();
		if (response.status === 200) {
			return { ok: true, error: null, data: data as IPaginadoDiretorias, status: 200 };
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar diretorias',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar diretorias: ' + error,
			data: null,
			status: 400,
		};
	}
}
