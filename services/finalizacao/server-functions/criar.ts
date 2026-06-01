/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { ICreateFinalizacao, IRespostaFinalizacao } from '@/types/finalizacao';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criar(
	data: ICreateFinalizacao,
): Promise<IRespostaFinalizacao> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}finalizacao/criar`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify(data),
			},
		);
		const dataResponse = await response.json();

		if (response.status === 201 || response.status === 200) {
			revalidateTag(`processo-${data.inicial_id}`);
			revalidatePath(`/processos/${data.inicial_id}`);
			revalidatePath('/processos');
			return {
				ok: true,
				error: null,
				data: dataResponse,
				status: response.status,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao finalizar processo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao finalizar processo: ' + error,
			data: null,
			status: 500,
		};
	}
}
