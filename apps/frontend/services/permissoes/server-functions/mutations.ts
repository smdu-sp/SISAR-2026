/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { chamarApi } from '@/lib/api-fetch';
import { IMatrizPermissoes } from '@/types/permissoes';
import { redirect } from 'next/navigation';

async function token() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function definirPerfil(perfil: string, recursos: string[]) {
	return chamarApi<IMatrizPermissoes>(`permissoes/${perfil}`, await token(), {
		method: 'PUT',
		body: { recursos },
	});
}

export async function restaurarPadrao() {
	return chamarApi<IMatrizPermissoes>('permissoes/restaurar-padrao', await token(), {
		method: 'POST',
	});
}
