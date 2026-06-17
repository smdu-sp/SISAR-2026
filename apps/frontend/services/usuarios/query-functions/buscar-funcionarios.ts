/** @format */

import { IFuncionarios, IRespostaUsuario } from '@/types/usuario';

export type { IFuncionarios };

export async function buscarFuncionarios(
	access_token: string,
): Promise<IRespostaUsuario> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}usuarios/buscar-funcionarios`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['funcionarios'], revalidate: 120 },
		});
		const data = await response.json();

		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IFuncionarios,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message ?? 'Não foi possível buscar funcionários',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar funcionários: ' + error,
			data: null,
			status: 500,
		};
	}
}
