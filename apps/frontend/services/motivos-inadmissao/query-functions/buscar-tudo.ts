/** @format */

import { IPaginadoMotivosInadmissao, IRespostaMotivoInadmissao } from '@/types/motivos-inadmissao';

export async function buscarTudo(
	access_token: string,
	pagina = 1,
	limite = 10,
	busca = '',
): Promise<IRespostaMotivoInadmissao> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(
			`${baseURL}motivos-inadmissao/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(busca)}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['motivos-inadmissao'], revalidate: 120 },
			},
		);
		const data = await response.json();
		if (response.status === 200) {
			return { ok: true, error: null, data: data as IPaginadoMotivosInadmissao, status: 200 };
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar motivos',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar motivos: ' + error,
			data: null,
			status: 400,
		};
	}
}
