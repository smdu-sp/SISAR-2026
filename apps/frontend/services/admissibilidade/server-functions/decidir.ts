/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import {
	IAdmissibilidade,
	IInterfacesAdmissibilidade,
	IRespostaAdmissibilidade,
} from '@/types/admissibilidade';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export interface IAdmitirPayload {
	unidade_id: string;
	subprefeitura_id: string;
	data_decisao_interlocutoria: Date | string;
	tipo_processo: number;
	interfaces?: IInterfacesAdmissibilidade;
}

export interface IInadmitirPayload {
	parecer_admissibilidade_id: string;
	obs?: string;
}

async function post(
	url: string,
	body: object,
): Promise<IRespostaAdmissibilidade> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(body),
		});
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag('admissibilidade');
			revalidatePath('/processos');
			return {
				ok: true,
				error: null,
				data: dataResponse as IAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro na operação',
			data: null,
			status: dataResponse.statusCode ?? response.status,
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

export async function admitir(
	inicialId: number,
	payload: IAdmitirPayload,
): Promise<IRespostaAdmissibilidade> {
	const res = await post(`admissibilidade/admitir/${inicialId}`, payload);
	if (res.ok) revalidatePath(`/processos/${inicialId}`);
	return res;
}

export async function inadmitir(
	inicialId: number,
	payload: IInadmitirPayload,
): Promise<IRespostaAdmissibilidade> {
	const res = await post(`admissibilidade/inadmitir/${inicialId}`, payload);
	if (res.ok) revalidatePath(`/processos/${inicialId}`);
	return res;
}
