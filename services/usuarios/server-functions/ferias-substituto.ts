/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function adicionarFerias(
	id: string,
	inicio: Date,
	final: Date,
) {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	const response = await fetch(`${baseURL}usuarios/adiciona-ferias/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.access_token}`,
		},
		body: JSON.stringify({ inicio, final }),
	});

	revalidateTag('user-by-id');
	return response.ok;
}

export async function adicionarSubstituto(
	usuario_id: string,
	substituto_id: string,
) {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	const response = await fetch(`${baseURL}usuarios/adicionar-substituto`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.access_token}`,
		},
		body: JSON.stringify({ usuario_id, substituto_id }),
	});

	revalidateTag('user-by-id');
	return response.ok;
}

export async function removerSubstituto(id: string) {
	const session = await auth();
	if (!session) redirect('/login');
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	const response = await fetch(
		`${baseURL}usuarios/remover-substituto/${id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		},
	);

	revalidateTag('user-by-id');
	return response.ok;
}
