/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { chamarApi } from '@/lib/api-fetch';
import {
	IEnvioAgendado,
	IEnvioAgendadoPayload,
	IHistoricoEnvio,
	IResultadoExecucao,
} from '@/types/envio-relatorios';
import { redirect } from 'next/navigation';

async function token() {
	const session = await auth();
	if (!session) redirect('/login');
	return session.access_token;
}

export async function criar(payload: IEnvioAgendadoPayload) {
	return chamarApi<IEnvioAgendado>('relatorio-agendamentos', await token(), {
		method: 'POST',
		body: payload,
	});
}

export async function atualizar(id: string, payload: Partial<IEnvioAgendadoPayload>) {
	return chamarApi<IEnvioAgendado>(`relatorio-agendamentos/${id}`, await token(), {
		method: 'PATCH',
		body: payload,
	});
}

export async function remover(id: string) {
	return chamarApi<{ message: string }>(`relatorio-agendamentos/${id}`, await token(), {
		method: 'DELETE',
	});
}

export async function executarAgora(id: string) {
	return chamarApi<IResultadoExecucao>(`relatorio-agendamentos/${id}/executar`, await token(), {
		method: 'POST',
	});
}

export async function historico(id: string) {
	return chamarApi<IHistoricoEnvio[]>(`relatorio-agendamentos/${id}/historico`, await token());
}
