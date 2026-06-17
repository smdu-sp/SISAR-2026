/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IRespostaDistribuicao } from '@/types/distribuicao';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function patchDistribuicao(
	inicialId: number,
	url: string,
	body: Record<string, string>,
): Promise<IRespostaDistribuicao> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}${url}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(body),
		});
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag(`processo-${inicialId}`);
			revalidatePath(`/processos/${inicialId}`);
			return {
				ok: true,
				error: null,
				data: dataResponse,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar distribuição',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao atualizar distribuição: ' + error,
			data: null,
			status: 500,
		};
	}
}

export async function mudarAdministrativo(
	inicialId: number,
	administrativo_responsavel_id: string,
) {
	return patchDistribuicao(
		inicialId,
		`distribuicao/administrativo/atualizar/${inicialId}`,
		{ administrativo_responsavel_id },
	);
}

export async function mudarTecnico(
	inicialId: number,
	tecnico_responsavel_id: string,
) {
	return patchDistribuicao(
		inicialId,
		`distribuicao/tecnico/atualizar/${inicialId}`,
		{ tecnico_responsavel_id },
	);
}
