/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { ICoordenadoria, IRespostaCoordenadoria } from '@/types/coordenadorias';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(data: {
	nome: string;
	sigla: string;
}): Promise<IRespostaCoordenadoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}coordenadorias/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('coordenadorias');
			return { ok: true, error: null, data: dataResponse as ICoordenadoria, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar coordenadoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao criar coordenadoria: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(
	id: string,
	data: Partial<{ nome: string; sigla: string }>,
): Promise<IRespostaCoordenadoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}coordenadorias/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('coordenadorias');
			return { ok: true, error: null, data: dataResponse as ICoordenadoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar coordenadoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao atualizar coordenadoria: ' + error, data: null, status: 500 };
	}
}

export async function remover(id: string): Promise<IRespostaCoordenadoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}coordenadorias/remover/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('coordenadorias');
			return { ok: true, error: null, data: dataResponse as ICoordenadoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao remover coordenadoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao remover coordenadoria: ' + error, data: null, status: 500 };
	}
}
