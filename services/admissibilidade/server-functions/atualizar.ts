/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import {
	IAdmissibilidade,
	IRespostaAdmissibilidade,
	IUpdateAdmissibilidade,
} from '@/types/admissibilidade';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function atualizar(
	inicialId: number,
	data: IUpdateAdmissibilidade,
): Promise<IRespostaAdmissibilidade> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}admissibilidade/atualizar-id/${inicialId}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify(data),
			},
		);
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag('admissibilidade');
			revalidatePath('/processos');
			revalidatePath(`/processos/${inicialId}`);
			return {
				ok: true,
				error: null,
				data: dataResponse as IAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar admissibilidade',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao atualizar admissibilidade: ' + error,
			data: null,
			status: 500,
		};
	}
}
