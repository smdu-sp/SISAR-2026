/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { ICategoria, IRespostaCategoria } from '@/types/categorias';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(data: {
	categoria: string;
	descricao?: string;
	divisao?: string;
	competencia?: string;
}): Promise<IRespostaCategoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}categorias/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('categorias');
			return { ok: true, error: null, data: dataResponse as ICategoria, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar categoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao criar categoria: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(
	id: string,
	data: Partial<{
		categoria: string;
		descricao: string;
		divisao: string;
		competencia: string;
	}>,
): Promise<IRespostaCategoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}categorias/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('categorias');
			return { ok: true, error: null, data: dataResponse as ICategoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar categoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao atualizar categoria: ' + error, data: null, status: 500 };
	}
}

export async function remover(id: string): Promise<IRespostaCategoria> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}categorias/remover/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('categorias');
			return { ok: true, error: null, data: dataResponse as ICategoria, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao remover categoria',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao remover categoria: ' + error, data: null, status: 500 };
	}
}
