/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IRespostaAnalise } from '@/types/analise';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function request(
	url: string,
	method: string,
	body?: object,
): Promise<IRespostaAnalise> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}${url}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: body ? JSON.stringify(body) : undefined,
		});
		const data = await response.json();

		if (response.ok) {
			return { ok: true, error: null, data, status: response.status };
		}

		return {
			ok: false,
			error: data.message ?? 'Erro na operação',
			data: null,
			status: data.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro na operação: ' + error,
			data: null,
			status: 500,
		};
	}
}

function revalidarProcesso(inicialId: number) {
	revalidateTag(`processo-${inicialId}`);
	revalidatePath(`/processos/${inicialId}`);
	revalidatePath('/processos');
}

export type IRegistrarPreReuniaoPayload = {
	data_reuniao: string;
	data_processo: string;
	numero_reuniao: string;
	parecer_grupo: string;
	nova_data_reuniao?: string;
	justificativa_remarcacao?: string;
};

export async function registrarPreReuniao(
	inicialId: number,
	payload: IRegistrarPreReuniaoPayload,
) {
	const res = await request(
		`analise/pre-reuniao/${inicialId}`,
		'POST',
		payload,
	);
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}

export async function registrarComuniqueSe(
	inicialId: number,
	payload: { data: string; complementar?: boolean },
) {
	const res = await request(
		`analise/comunique-se/${inicialId}`,
		'POST',
		payload,
	);
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}

export async function registrarRespostaComuniqueSe(
	comuniqueId: string,
	inicialId: number,
	data_resposta: string,
) {
	const res = await request(
		`analise/comunique-se/${comuniqueId}/resposta`,
		'PATCH',
		{ data_resposta },
	);
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}

export async function registrarDecisao(
	inicialId: number,
	parecer: number,
	obs?: string,
) {
	const res = await request(`analise/decisao/${inicialId}`, 'POST', {
		parecer,
		obs,
	});
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}

export async function registrarRecurso(inicialId: number) {
	const res = await request(`analise/recurso/${inicialId}`, 'POST');
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}

export async function encerrarSemRecurso(inicialId: number) {
	const res = await request(`analise/encerrar-recurso/${inicialId}`, 'POST');
	if (res.ok) revalidarProcesso(inicialId);
	return res;
}
