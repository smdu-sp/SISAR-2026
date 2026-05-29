/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IMotivoInadmissao, IRespostaMotivoInadmissao } from '@/types/motivos-inadmissao';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(descricao: string): Promise<IRespostaMotivoInadmissao> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}motivos-inadmissao/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ descricao }),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('motivos-inadmissao');
			return { ok: true, error: null, data: dataResponse as IMotivoInadmissao, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao criar motivo: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(
	id: string,
	descricao: string,
): Promise<IRespostaMotivoInadmissao> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}motivos-inadmissao/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ descricao }),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('motivos-inadmissao');
			return { ok: true, error: null, data: dataResponse as IMotivoInadmissao, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao atualizar motivo: ' + error, data: null, status: 500 };
	}
}

export async function remover(id: string): Promise<IRespostaMotivoInadmissao> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}motivos-inadmissao/remover/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('motivos-inadmissao');
			return { ok: true, error: null, data: dataResponse as IMotivoInadmissao, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao remover motivo',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao remover motivo: ' + error, data: null, status: 500 };
	}
}
