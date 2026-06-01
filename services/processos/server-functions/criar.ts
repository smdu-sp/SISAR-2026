/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { ICreateProcesso, IProcesso, IRespostaProcessos } from '@/types/processos';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criar(
	data: ICreateProcesso,
): Promise<IRespostaProcessos> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}inicial/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify({
				...data,
				decreto: data.decreto ?? false,
				requalifica_rapido: data.requalifica_rapido ?? false,
				associado_reforma: data.associado_reforma ?? false,
				tipo_processo: data.tipo_processo ?? 1,
				aprova_digital: data.aprova_digital ?? '',
				processo_fisico: data.processo_fisico ?? '',
			}),
		});
		const dataResponse = await response.json();

		if (response.status === 201 || response.status === 200) {
			revalidateTag('processos');
			revalidatePath('/processos');
			return {
				ok: true,
				error: null,
				data: dataResponse as IProcesso,
				status: response.status,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar processo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao criar processo: ' + error,
			data: null,
			status: 500,
		};
	}
}
