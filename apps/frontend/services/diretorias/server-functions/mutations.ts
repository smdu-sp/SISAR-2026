/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IDiretoria, IRespostaDiretoria } from '@/types/diretorias';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(data: {
	nome: string;
	coordenadoria_id: string;
}): Promise<IRespostaDiretoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}diretorias/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('diretorias');
			return { ok: true, error: null, data: dataResponse as IDiretoria, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar diretoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao criar diretoria: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(
	id: string,
	data: Partial<{ nome: string; coordenadoria_id: string }>,
): Promise<IRespostaDiretoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}diretorias/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('diretorias');
			return { ok: true, error: null, data: dataResponse as IDiretoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar diretoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao atualizar diretoria: ' + error, data: null, status: 500 };
	}
}

export async function remover(id: string): Promise<IRespostaDiretoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}diretorias/remover/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('diretorias');
			return { ok: true, error: null, data: dataResponse as IDiretoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao remover diretoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao remover diretoria: ' + error, data: null, status: 500 };
	}
}
