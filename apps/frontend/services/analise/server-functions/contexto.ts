/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IContextoAnalise, IRespostaAnalise } from '@/types/analise';
import { redirect } from 'next/navigation';

export async function obterContexto(
	inicialId: number,
): Promise<IRespostaAnalise> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}analise/contexto/${inicialId}`,
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

		if (response.ok) {
			return {
				ok: true,
				error: null,
				data: data as IContextoAnalise,
				status: 200,
			};
		}

		return {
			ok: false,
			error: data.message ?? 'Erro ao carregar análise',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao carregar análise: ' + error,
			data: null,
			status: 500,
		};
	}
}
