/** @format */

import { IPaginadoPedidos, IRespostaPedido } from '@/types/pedidos';

export async function buscarTudo(
	access_token: string,
	pagina = 1,
	limite = 10,
	busca = '',
): Promise<IRespostaPedido> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(
			`${baseURL}pedidos/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(busca)}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['pedidos'], revalidate: 120 },
			},
		);
		const data = await response.json();
		if (response.status === 200) {
			return { ok: true, error: null, data: data as IPaginadoPedidos, status: 200 };
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao buscar pedidos',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar pedidos: ' + error,
			data: null,
			status: 400,
		};
	}
}
