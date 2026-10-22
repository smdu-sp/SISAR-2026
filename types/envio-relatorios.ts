/** @format */

export type FrequenciaEnvio = 'DIARIA' | 'SEMANAL' | 'MENSAL';
export type PeriodoRelatorio = 'MES_ANTERIOR' | 'MES_ATUAL' | 'ANO_ATUAL';

export interface IEnvioAgendado {
	id: string;
	nome: string;
	tipo_relatorio: string;
	formato_pdf: boolean;
	formato_excel: boolean;
	destinatarios: string[];
	assunto: string | null;
	mensagem: string | null;
	frequencia: FrequenciaEnvio;
	dia_do_mes: number | null;
	dia_da_semana: number | null;
	hora: number;
	minuto: number;
	periodo: PeriodoRelatorio;
	ativo: boolean;
	proximo_envio_em: string | null;
	ultimo_envio_em: string | null;
}

export interface IEnvioAgendadoPayload {
	nome: string;
	tipo_relatorio: string;
	formato_pdf: boolean;
	formato_excel: boolean;
	destinatarios: string[];
	assunto?: string;
	mensagem?: string;
	frequencia: FrequenciaEnvio;
	dia_do_mes?: number;
	dia_da_semana?: number;
	hora: number;
	minuto: number;
	periodo: PeriodoRelatorio;
	ativo: boolean;
}

export interface IHistoricoEnvio {
	id: string;
	executado_em: string;
	origem: 'AGENDADO' | 'MANUAL';
	sucesso: boolean;
	destinatarios: string[];
	arquivos: string[] | null;
	erro: string | null;
}

export interface IResultadoExecucao {
	sucesso: boolean;
	arquivos: string[] | null;
	erro: string | null;
}
