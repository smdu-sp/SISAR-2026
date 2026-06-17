/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IProcesso, IRespostaProcessos } from '@/types/processos';
import { redirect } from 'next/navigation';

export async function verificaSei(sei: string): Promise<IRespostaProcessos> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const seiLimpo = sei.replace(/\D/g, '');

	try {
		const response = await fetch(
			`${baseURL}inicial/verifica-sei/${seiLimpo}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
				cache: 'no-store',
			},
		);
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
