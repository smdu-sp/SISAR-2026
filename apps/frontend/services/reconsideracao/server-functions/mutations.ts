/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

async function request(url: string, method: string, body?: object) {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

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
		revalidateTag('admissibilidade');
		revalidatePath('/processos');
		return { ok: true as const, data, error: null };
	}

	return {
		ok: false as const,
		error: data.message ?? 'Erro na operação',
		data: null,
	};
}

export async function registrarPedido(
	inicialId: number,
	payload: {
		pedido_reconsideracao: string;
		envio?: string;
		publicacao?: string;
	},
) {
	const res = await request(
		`reconsideracao-admissibilidade/pedido/${inicialId}`,
		'POST',
		payload,
	);
	if (res.ok) {
		revalidateTag(`processo-${inicialId}`);
		revalidatePath(`/processos/${inicialId}`);
	}
	return res;
}

export async function aceitar(inicialId: number) {
	const res = await request(
		`reconsideracao-admissibilidade/aceitar/${inicialId}`,
		'PATCH',
	);
	if (res.ok) {
		revalidateTag(`processo-${inicialId}`);
		revalidatePath(`/processos/${inicialId}`);
		revalidatePath('/processos');
	}
	return res;
}

export async function rejeitar(inicialId: number) {
	const res = await request(
		`reconsideracao-admissibilidade/rejeitar/${inicialId}`,
		'PATCH',
	);
	if (res.ok) {
		revalidateTag(`processo-${inicialId}`);
		revalidatePath(`/processos/${inicialId}`);
	}
	return res;
}
