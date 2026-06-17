/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IRespostaUnidades, IUnidades } from '@/types/unidades';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(data: {
	nome: string;
	sigla: string;
	codigo: string;
	status: number;
}): Promise<IRespostaUnidades> {
	const token = await getToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}unidades/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('unidades');
			return { ok: true, error: null, data: dataResponse as IUnidades, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar unidade',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(
	id: string,
	data: Partial<{ nome: string; sigla: string; codigo: string; status: number }>,
): Promise<IRespostaUnidades> {
	const token = await getToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}unidades/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('unidades');
			return { ok: true, error: null, data: dataResponse as IUnidades, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro: ' + error, data: null, status: 500 };
	}
}
