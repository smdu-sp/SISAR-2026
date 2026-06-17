/** @format */

import { InfoPrazoFase, prazoEtapaAtualListagem } from '@/lib/prazo-fase';
import { formatarSei, formataProcesso } from '@/lib/utils';
import { IProcesso } from '@/types/processos';

export type NivelAlertaPrazo = 'neutro' | 'ok' | 'atencao' | 'critico' | 'atraso';

export function seiPreenchido(sei?: string | null): boolean {
	if (!sei) return false;
	return sei.replace(/\D/g, '').length > 0;
}

/** Exibe SEI formatado quando existir; caso contrário, número do processo físico. */
export function rotuloProcessoListagem(processo: {
	sei?: string | null;
	processo_fisico?: string | null;
}): string {
	if (seiPreenchido(processo.sei)) return formatarSei(processo.sei!);
	if (processo.processo_fisico) return formataProcesso(processo.processo_fisico);
	return '-';
}

export function nivelAlertaPrazo(
	dias: number | null | undefined,
): NivelAlertaPrazo {
	if (dias == null) return 'neutro';
	if (dias < 0) return 'atraso';
	if (dias <= 5) return 'critico';
	if (dias <= 9) return 'atencao';
	return 'ok';
}

export function classeLinhaAlertaPrazo(
	nivel: NivelAlertaPrazo,
): string | undefined {
	switch (nivel) {
		case 'atraso':
			return 'bg-red-100/90 hover:bg-red-100/90 dark:bg-red-950/45 dark:hover:bg-red-950/45';
		case 'critico':
			return 'bg-red-50 hover:bg-red-50 dark:bg-red-950/30 dark:hover:bg-red-950/30';
		case 'atencao':
			return 'bg-red-50/70 hover:bg-red-50/70 dark:bg-red-950/20 dark:hover:bg-red-950/20';
		default:
			return undefined;
	}
}

export function classeTextoDiasPrazo(
	dias: number | null | undefined,
): string {
	if (dias == null) return 'text-muted-foreground';
	if (dias < 0) return 'font-semibold text-red-700 dark:text-red-400';
	if (dias <= 3) return 'font-semibold text-red-600 dark:text-red-400';
	if (dias <= 5) return 'font-medium text-red-500 dark:text-red-400';
	if (dias <= 9) return 'text-orange-600 dark:text-orange-400';
	return 'text-foreground';
}

export function textoCelulaDiasPrazo(info: InfoPrazoFase): string {
	if (info.diasRestantes != null) {
		if (info.diasRestantes < 0) {
			const atraso = Math.abs(info.diasRestantes);
			return `-${atraso}`;
		}
		return String(info.diasRestantes);
	}
	if (info.estado === 'finalizada' || info.estado === 'sem_prazo') return '—';
	return '—';
}

export function resumoPrazoListagem(processo: IProcesso): {
	info: InfoPrazoFase;
	nivel: NivelAlertaPrazo;
} {
	const info = prazoEtapaAtualListagem(processo);
	const nivel = nivelAlertaPrazo(info.diasRestantes);
	return { info, nivel };
}

export function classeLinhaProcesso(processo: IProcesso): string | undefined {
	const { nivel } = resumoPrazoListagem(processo);
	return classeLinhaAlertaPrazo(nivel);
}
