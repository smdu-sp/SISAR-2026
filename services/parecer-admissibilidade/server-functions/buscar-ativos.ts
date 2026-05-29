/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { buscarTudo } from '../query-functions/buscar-tudo';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { redirect } from 'next/navigation';

export async function buscarLista(): Promise<IParecerAdmissibilidade[]> {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const response = await buscarTudo(session.access_token, 1, 100);
	if (!response.ok || !response.data || !('data' in response.data)) {
		return [];
	}

	return response.data.data;
}

export async function buscarAtivos(): Promise<IParecerAdmissibilidade[]> {
	const lista = await buscarLista();
	return lista.filter((item) => item.status === 1);
}
