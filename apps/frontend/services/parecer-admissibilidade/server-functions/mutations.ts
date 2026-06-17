/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import {
	ICriarParecerAdmissibilidade,
	IParecerAdmissibilidade,
	IRespostaParecerAdmissibilidade,
} from '@/types/parecer-admissibilidade';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criar(
	data: ICriarParecerAdmissibilidade,
): Promise<IRespostaParecerAdmissibilidade> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(`${baseURL}parecer-admissibilidade/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify({ ...data, status: data.status ?? 1 }),
		});
		const dataResponse = await response.json();

		if (response.status === 201) {
			revalidateTag('parecer-admissibilidade');
			return {
				ok: true,
				error: null,
				data: dataResponse as IParecerAdmissibilidade,
				status: 201,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao criar motivo: ' + error,
			data: null,
			status: 500,
		};
	}
}

export async function atualizar(
	id: string,
	parecer: string,
): Promise<IRespostaParecerAdmissibilidade> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}parecer-admissibilidade/atualizar/${id}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({ parecer }),
			},
		);
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag('parecer-admissibilidade');
			return {
				ok: true,
				error: null,
				data: dataResponse as IParecerAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao atualizar motivo: ' + error,
			data: null,
			status: 500,
		};
	}
}

export async function desativar(
	id: string,
): Promise<IRespostaParecerAdmissibilidade> {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	try {
		const response = await fetch(
			`${baseURL}parecer-admissibilidade/desativar/${id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		);
		const dataResponse = await response.json();

		if (response.status === 200) {
			revalidateTag('parecer-admissibilidade');
			return {
				ok: true,
				error: null,
				data: dataResponse as IParecerAdmissibilidade,
				status: 200,
			};
		}

		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao desativar motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Erro ao desativar motivo: ' + error,
			data: null,
			status: 500,
		};
	}
}
