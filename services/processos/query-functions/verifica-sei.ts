/** @format */

import { IProcesso, IRespostaProcessos } from '@/types/processos';

export async function verificaSei(
	access_token: string,
	sei: string,
): Promise<IRespostaProcessos> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const seiLimpo = sei.replace(/\D/g, '');

	try {
		const response = await fetch(`${baseURL}inicial/verifica-sei/${seiLimpo}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			cache: 'no-store',
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
			error: data.message ?? 'Processo não encontrado',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível verificar o SEI: ' + error,
			data: null,
			status: 400,
		};
	}
}
