/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IProcesso, IRespostaProcessos } from '@/types/processos';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export interface IUpdateProcesso {
	tipo_processo?: number;
	status?: number;
	etapa_analise?: number;
	substatus_analise?: number;
	interfaces?: Record<string, unknown>;
}

export async function atualizar(
	id: number,
	data: IUpdateProcesso,
): Promise<IRespostaProcessos> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}inicial/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag(`processo-${id}`);
			revalidatePath(`/processos/${id}`);
			revalidatePath('/processos');
			revalidateTag('admissibilidade');
			return {
				ok: true,
				error: null,
				data: dataResponse as IProcesso,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar processo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao atualizar processo: ' + error,
			data: null,
			status: 500,
		};
	}
}
