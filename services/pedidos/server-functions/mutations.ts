/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IPedido, IRespostaPedido } from '@/types/pedidos';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSessionToken() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(descricao: string): Promise<IRespostaPedido> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}pedidos/criar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ descricao }),
		});
		const dataResponse = await response.json();
		if (response.status === 201) {
			revalidateTag('pedidos');
			return { ok: true, error: null, data: dataResponse as IPedido, status: 201 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar pedido',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao criar pedido: ' + error, data: null, status: 500 };
	}
}

export async function atualizar(id: string, descricao: string): Promise<IRespostaPedido> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}pedidos/atualizar/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ descricao }),
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('pedidos');
			return { ok: true, error: null, data: dataResponse as IPedido, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar pedido',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao atualizar pedido: ' + error, data: null, status: 500 };
	}
}

export async function remover(id: string): Promise<IRespostaPedido> {
	const token = await getSessionToken();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}pedidos/remover/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		const dataResponse = await response.json();
		if (response.status === 200) {
			revalidateTag('pedidos');
			return { ok: true, error: null, data: dataResponse as IPedido, status: 200 };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao remover pedido',
			data: null,
			status: dataResponse.statusCode ?? response.status,
		};
	} catch (error) {
		return { ok: false, error: 'Erro ao remover pedido: ' + error, data: null, status: 500 };
	}
}
