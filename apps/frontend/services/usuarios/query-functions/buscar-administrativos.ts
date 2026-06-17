/** @format */

import { IRespostaUsuario, IUsuario } from '@/types/usuario';

export async function buscarAdministrativos(
	access_token: string,
): Promise<IRespostaUsuario> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}usuarios/buscar-administrativos`, {
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
				data: data as IUsuario[],
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
			error: 'Não foi possível buscar administrativos: ' + error,
			data: null,
			status: 400,
		};
	}
}
