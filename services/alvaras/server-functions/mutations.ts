/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IAlvaraTipoForm, IAlvaras, IRespostaAlvaras } from '@/types/alvaras';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(data: IAlvaraTipoForm): Promise<IRespostaAlvaras> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}alvara-tipo/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('alvaras');
			return { ok: true, error: null, data: dataResponse as IAlvaras, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar tipo de alvará',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao criar tipo de alvará: ' + error,
			data: null,
			status: 500,
		};
	}
}

export async function atualizar(
	id: string,
	data: Partial<IAlvaraTipoForm>,
): Promise<IRespostaAlvaras> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}alvara-tipo/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('alvaras');
			revalidateTag(`alvara-${id}`);
			return { ok: true, error: null, data: dataResponse as IAlvaras, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar tipo de alvará',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao atualizar tipo de alvará: ' + error,
			data: null,
			status: 500,
		};
	}
}
