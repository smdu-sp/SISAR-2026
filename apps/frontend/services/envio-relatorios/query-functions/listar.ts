/** @format */

import { chamarApi } from '@/lib/api-fetch';
import { IEnvioAgendado } from '@/types/envio-relatorios';

export function listar(token?: string) {
	return chamarApi<IEnvioAgendado[]>('relatorio-agendamentos', token);
}

export function statusEmail(token?: string) {
	return chamarApi<{ configurado: boolean }>('relatorio-agendamentos/status-email', token);
}
