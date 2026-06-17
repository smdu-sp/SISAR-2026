/** @format */

import { dataEnvioAdmissibilidade, IAdmissibilidade } from '@/types/admissibilidade';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';

export type FasePrazoProcesso =
	| 'dados'
	| 'distribuicao'
	| 'admissibilidade'
	| 'analise'
	| 'finalizacao';

export type EstadoPrazoFase =
	| 'pendente'
	| 'em_andamento'
	| 'finalizada'
	| 'sem_prazo';

export interface InfoPrazoFase {
	titulo: string;
	estado: EstadoPrazoFase;
	mensagem: string;
	detalhe?: string;
	variant: 'default' | 'secondary' | 'destructive' | 'outline';
	/** Dias até o limite (negativo = em atraso). Preenchido em prazos em andamento. */
	diasRestantes?: number | null;
}

function normalizarData(valor: string | Date): Date {
	const d = new Date(valor);
	d.setHours(0, 0, 0, 0);
	return d;
}

function adicionarDias(data: Date, dias: number): Date {
	const r = new Date(data);
	r.setDate(r.getDate() + dias);
	return r;
}

function diffDias(inicio: Date, fim: Date): number {
	return Math.round((fim.getTime() - inicio.getTime()) / (1000 * 3600 * 24));
}

function formatarDataBr(valor?: string | Date | null): string {
	if (!valor) return '';
	const d = new Date(valor);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('pt-BR');
}

function prazoAdmissibilidadeDias(processo: IProcesso): number {
	const alvara = processo.alvara_tipo;
	if (!alvara) return 15;
	return processo.tipo_processo === 2
		? alvara.prazo_admissibilidade_multi
		: alvara.prazo_admissibilidade_smul;
}

function prazoEmissaoAlvaraDias(processo: IProcesso): number {
	const alvara = processo.alvara_tipo;
	if (!alvara) return 0;
	return processo.tipo_processo === 2
		? alvara.prazo_emissao_alvara_multi
		: alvara.prazo_emissao_alvara_smul;
}

/** Data em que a análise técnica foi encerrada (deferimento ou indeferimento definitivo). */
export function dataEncerramentoAnalise(processo: IProcesso): Date | null {
	if (processo.status !== 3 && processo.status !== 4) return null;

	const decisoes =
		processo.decisoes?.filter(
			(d) =>
				d.publicacao_parecer &&
				(d.parecer === 1 || d.parecer === 2),
		) ?? [];

	if (decisoes.length > 0) {
		const ordenadas = [...decisoes].sort(
			(a, b) =>
				new Date(b.publicacao_parecer!).getTime() -
				new Date(a.publicacao_parecer!).getTime(),
		);
		return normalizarData(ordenadas[0].publicacao_parecer!);
	}

	return null;
}

function inicioAnaliseTecnica(
	processo: IProcesso,
	adm?: IAdmissibilidade | null,
): Date | null {
	const base =
		adm?.data_decisao_interlocutoria ??
		dataEnvioAdmissibilidade(adm, processo);
	if (!base) return null;
	return normalizarData(base);
}

function variantPorDiasRestantes(dias: number): InfoPrazoFase['variant'] {
	if (dias < 0) return 'destructive';
	if (dias <= 5) return 'destructive';
	if (dias <= 9) return 'default';
	return 'secondary';
}

export function calcularPrazoFase(
	fase: FasePrazoProcesso,
	processo: IProcesso,
	opcoes?: {
		admissibilidade?: IAdmissibilidade | null;
		conclusao?: IConclusao | null;
	},
): InfoPrazoFase {
	const adm = opcoes?.admissibilidade ?? processo.admissibilidade;
	const conclusao = opcoes?.conclusao ?? processo.conclusao;
	const hoje = normalizarData(new Date());

	switch (fase) {
		case 'dados': {
			const protocolo = processo.data_protocolo
				? normalizarData(processo.data_protocolo)
				: null;
			const envio = dataEnvioAdmissibilidade(adm, processo);
			if (!protocolo) {
				return {
					titulo: 'Prazo — Dados iniciais',
					estado: 'sem_prazo',
					mensagem: 'Data de protocolo não informada',
					variant: 'outline',
				};
			}
			if (!envio) {
				return {
					titulo: 'Prazo — Dados iniciais',
					estado: 'em_andamento',
					mensagem: 'Aguardando envio à admissibilidade',
					detalhe: `Protocolo em ${formatarDataBr(protocolo)}`,
					variant: 'secondary',
				};
			}
			const fim = normalizarData(envio);
			const dias = diffDias(protocolo, fim);
			return {
				titulo: 'Prazo — Dados iniciais',
				estado: 'finalizada',
				mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
				detalhe: `De ${formatarDataBr(protocolo)} até envio em ${formatarDataBr(fim)}`,
				variant: 'secondary',
			};
		}

		case 'distribuicao': {
			const dist = processo.distribuicao;
			const protocolo = processo.data_protocolo
				? normalizarData(processo.data_protocolo)
				: null;
			if (!dist || !protocolo) {
				return {
					titulo: 'Prazo — Distribuição',
					estado: 'pendente',
					mensagem: 'Distribuição ainda não registrada',
					variant: 'outline',
				};
			}
			if (!dist.tecnico_responsavel_id) {
				const dias = diffDias(protocolo, hoje);
				return {
					titulo: 'Prazo — Distribuição',
					estado: 'em_andamento',
					mensagem: `Em andamento há ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe: 'Aguardando alocação do técnico responsável',
					variant: dias > 5 ? 'destructive' : 'default',
				};
			}
			const envio = dataEnvioAdmissibilidade(adm, processo);
			const fim = envio ? normalizarData(envio) : hoje;
			const dias = diffDias(protocolo, fim);
			return {
				titulo: 'Prazo — Distribuição',
				estado: 'finalizada',
				mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
				detalhe: envio
					? `Até envio à admissibilidade em ${formatarDataBr(envio)}`
					: 'Equipe administrativa e técnica alocadas',
				variant: 'secondary',
			};
		}

		case 'admissibilidade': {
			const envio = dataEnvioAdmissibilidade(adm, processo);
			if (!envio) {
				return {
					titulo: 'Prazo — Admissibilidade',
					estado: 'pendente',
					mensagem: 'Processo ainda não enviado à admissibilidade',
					variant: 'outline',
				};
			}
			const inicio = normalizarData(envio);
			const prazoDias = prazoAdmissibilidadeDias(processo);
			const limite = adicionarDias(inicio, prazoDias);
			const decisao = adm?.data_decisao_interlocutoria;

			if (decisao) {
				const fim = normalizarData(decisao);
				const dias = diffDias(inicio, fim);
				const noPrazo = dias <= prazoDias;
				return {
					titulo: 'Prazo — Admissibilidade',
					estado: 'finalizada',
					mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe: noPrazo
						? `Dentro do prazo legal de ${prazoDias} dias`
						: `Prazo legal: ${prazoDias} dias (ultrapassado)`,
					variant: noPrazo ? 'secondary' : 'destructive',
				};
			}

			const restantes = diffDias(hoje, limite);
			if (restantes >= 0) {
				return {
					titulo: 'Prazo — Admissibilidade',
					estado: 'em_andamento',
					mensagem: `${restantes} ${restantes === 1 ? 'dia restante' : 'dias restantes'}`,
					detalhe: `Limite em ${formatarDataBr(limite)} (${prazoDias} dias úteis corridos)`,
					variant: variantPorDiasRestantes(restantes),
					diasRestantes: restantes,
				};
			}
			const atraso = Math.abs(restantes);
			return {
				titulo: 'Prazo — Admissibilidade',
				estado: 'em_andamento',
				mensagem: `Em atraso há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}`,
				detalhe: `Limite era ${formatarDataBr(limite)}`,
				variant: 'destructive',
				diasRestantes: -atraso,
			};
		}

		case 'analise': {
			const inicio = inicioAnaliseTecnica(processo, adm);
			if (!inicio) {
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'pendente',
					mensagem: 'Aguardando conclusão da admissibilidade',
					variant: 'outline',
				};
			}

			const fimAnalise = dataEncerramentoAnalise(processo);
			if (fimAnalise) {
				const dias = diffDias(inicio, fimAnalise);
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'finalizada',
					mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe: `Encerrada em ${formatarDataBr(fimAnalise)}`,
					variant: 'secondary',
				};
			}

			if (processo.status === 3 || processo.status === 4) {
				const dias = diffDias(inicio, hoje);
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'finalizada',
					mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe:
						processo.status === 3
							? 'Processo deferido (sem data de publicação do parecer)'
							: 'Processo indeferido (sem data de publicação do parecer)',
					variant: 'secondary',
				};
			}

			if (processo.status !== 2) {
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'sem_prazo',
					mensagem: 'Fase de análise ainda não iniciada',
					variant: 'outline',
				};
			}

			const limiteRaw =
				processo.tipo_processo === 2
					? processo.data_limiteMulti ?? processo.data_limiteSmul
					: processo.data_limiteSmul;

			if (!limiteRaw) {
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'em_andamento',
					mensagem: 'Em andamento',
					detalhe: 'Prazo limite ainda não calculado no sistema',
					variant: 'secondary',
				};
			}

			const limite = normalizarData(limiteRaw);
			const restantes = diffDias(hoje, limite);
			if (restantes >= 0) {
				return {
					titulo: 'Prazo — Análise técnica',
					estado: 'em_andamento',
					mensagem: `${restantes} ${restantes === 1 ? 'dia restante' : 'dias restantes'}`,
					detalhe: `Limite em ${formatarDataBr(limite)}`,
					variant: variantPorDiasRestantes(restantes),
					diasRestantes: restantes,
				};
			}
			const atraso = Math.abs(restantes);
			return {
				titulo: 'Prazo — Análise técnica',
				estado: 'em_andamento',
				mensagem: `Em atraso há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}`,
				detalhe: `Limite era ${formatarDataBr(limite)}`,
				variant: 'destructive',
				diasRestantes: -atraso,
			};
		}

		case 'finalizacao': {
			if (processo.status !== 3) {
				return {
					titulo: 'Prazo — Finalização',
					estado: 'pendente',
					mensagem: 'Disponível após deferimento na análise técnica',
					variant: 'outline',
				};
			}

			const inicio = dataEncerramentoAnalise(processo);
			if (!inicio) {
				return {
					titulo: 'Prazo — Finalização',
					estado: 'em_andamento',
					mensagem: 'Em andamento',
					detalhe: 'Data de deferimento não registrada',
					variant: 'secondary',
				};
			}

			const prazoDias = prazoEmissaoAlvaraDias(processo);
			const limite =
				prazoDias > 0 ? adicionarDias(inicio, prazoDias) : null;

			if (conclusao?.data_conclusao) {
				const fim = normalizarData(conclusao.data_conclusao);
				const dias = diffDias(inicio, fim);
				const noPrazo = !limite || fim.getTime() <= limite.getTime();
				return {
					titulo: 'Prazo — Finalização',
					estado: 'finalizada',
					mensagem: `Levou ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe: noPrazo
						? limite
							? `Concluída em ${formatarDataBr(fim)} (prazo: ${prazoDias} dias)`
							: `Concluída em ${formatarDataBr(fim)}`
						: `Concluída em ${formatarDataBr(fim)} — após o prazo de ${prazoDias} dias`,
					variant: noPrazo ? 'secondary' : 'destructive',
				};
			}

			if (!limite || prazoDias <= 0) {
				const dias = diffDias(inicio, hoje);
				return {
					titulo: 'Prazo — Finalização',
					estado: 'em_andamento',
					mensagem: `Em andamento há ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
					detalhe: `Deferido em ${formatarDataBr(inicio)}`,
					variant: 'secondary',
				};
			}

			const restantes = diffDias(hoje, limite);
			if (restantes >= 0) {
				return {
					titulo: 'Prazo — Finalização',
					estado: 'em_andamento',
					mensagem: `${restantes} ${restantes === 1 ? 'dia restante' : 'dias restantes'}`,
					detalhe: `Limite em ${formatarDataBr(limite)} (emissão do alvará)`,
					variant: variantPorDiasRestantes(restantes),
					diasRestantes: restantes,
				};
			}
			const atraso = Math.abs(restantes);
			return {
				titulo: 'Prazo — Finalização',
				estado: 'em_andamento',
				mensagem: `Em atraso há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}`,
				detalhe: `Limite era ${formatarDataBr(limite)}`,
				variant: 'destructive',
				diasRestantes: -atraso,
			};
		}
	}
}

/** Fase de prazo correspondente à etapa em que o processo se encontra na listagem. */
export function inferirFasePrazoAtual(processo: IProcesso): FasePrazoProcesso {
	const status = processo.status ?? 0;
	if (status === 3) return 'finalizacao';
	if (status === 2) return 'analise';

	const adm = processo.admissibilidade;
	const envio = dataEnvioAdmissibilidade(adm, processo);
	const decisao = adm?.data_decisao_interlocutoria;

	if (status === 4 || status === 1 || decisao) return 'analise';

	if (envio && !decisao) return 'admissibilidade';

	if (!envio) {
		if (!processo.distribuicao?.tecnico_responsavel_id) return 'distribuicao';
		return 'dados';
	}

	return 'admissibilidade';
}

export function prazoEtapaAtualListagem(processo: IProcesso): InfoPrazoFase {
	return calcularPrazoFase(inferirFasePrazoAtual(processo), processo);
}
