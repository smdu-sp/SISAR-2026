/** @format */

'use client';

import { cn } from '@/lib/utils';
import { dataEnvioAdmissibilidade } from '@/types/admissibilidade';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import { AlertCircle, Check, CheckCircle2, Circle, Clock } from 'lucide-react';

interface EtapaTimeline {
	id: string;
	nome: string;
	prazo?: number;
	descricao: string;
	estado: 'concluida' | 'em_andamento' | 'pendente';
	excedeuPrazo?: boolean;
	inicio?: string;
	dataLimite?: string;
	conclusao?: string;
	conclusaoNoPrazo?: boolean;
	progresso: number;
}

function fmtBr(d: Date | string | null | undefined): string | undefined {
	if (!d) return undefined;
	try {
		const date = new Date(d);
		if (isNaN(date.getTime())) return undefined;
		return date.toLocaleDateString('pt-BR');
	} catch {
		return undefined;
	}
}

function addDias(d: Date | string, n: number): Date {
	const r = new Date(d);
	r.setDate(r.getDate() + n);
	return r;
}

function buildEtapas(processo: IProcesso, conclusao: IConclusao | null | undefined): EtapaTimeline[] {
	const etapas: EtapaTimeline[] = [];
	const status = processo.status ?? 0;
	const isMulti = processo.tipo_processo === 2;
	const alvara = processo.alvara_tipo;

	// Protocolo
	const proto = processo.data_protocolo ? new Date(processo.data_protocolo) : null;
	etapas.push({
		id: 'protocolo',
		nome: 'Protocolo',
		descricao: 'Entrada do processo no sistema SEI.',
		estado: 'concluida',
		inicio: fmtBr(proto),
		conclusao: fmtBr(proto),
		progresso: 100,
	});

	// Distribuição
	const dist = processo.distribuicao;
	const distFeita = !!dist?.tecnico_responsavel_id;
	const envioAdm = dataEnvioAdmissibilidade(processo.admissibilidade, processo);
	etapas.push({
		id: 'distribuicao',
		nome: 'Distribuição',
		prazo: 2,
		descricao: 'Atribuição de técnico e administrativo responsáveis.',
		estado: distFeita ? 'concluida' : status === 0 ? 'em_andamento' : 'pendente',
		inicio: fmtBr(proto),
		conclusao: distFeita && envioAdm ? fmtBr(new Date(envioAdm)) : undefined,
		progresso: distFeita ? 100 : 0,
	});

	// Admissibilidade
	const adm = processo.admissibilidade;
	const admInicio = envioAdm ? new Date(envioAdm) : null;
	if (admInicio || adm) {
		const prazoAdm = isMulti
			? (alvara?.prazo_admissibilidade_multi ?? 15)
			: (alvara?.prazo_admissibilidade_smul ?? 15);
		const admLimite = admInicio ? addDias(admInicio, prazoAdm) : null;
		const admFim = adm?.data_decisao_interlocutoria ? new Date(adm.data_decisao_interlocutoria) : null;
		const admExcedeu = !!(admFim && admLimite && admFim > admLimite);

		let admEstado: EtapaTimeline['estado'];
		if (admFim) admEstado = 'concluida';
		else if (status === 0) admEstado = 'em_andamento';
		else admEstado = 'pendente';

		etapas.push({
			id: 'admissibilidade',
			nome: 'Admissibilidade',
			prazo: prazoAdm,
			descricao: 'Verificação documental e decisão interlocutória de admissão.',
			estado: admEstado,
			excedeuPrazo: admExcedeu,
			inicio: fmtBr(admInicio),
			dataLimite: fmtBr(admLimite),
			conclusao: fmtBr(admFim),
			conclusaoNoPrazo: !admExcedeu,
			progresso: admFim ? 100 : 0,
		});
	}

	// Análise rounds
	const mostrarAnalise = status === 2 || status === 3 || status === 4;
	if (mostrarAnalise) {
		const decisoes = processo.decisoes ?? [];
		const etapaAtual = processo.etapa_analise ?? 1;
		const instanciasComDecisao = [...new Set(decisoes.map((d) => d.instancia ?? 1))].sort((a, b) => a - b);
		const maxInstancia = Math.max(etapaAtual, instanciasComDecisao.length > 0 ? Math.max(...instanciasComDecisao) : 1);
		const ords = ['', '1ª', '2ª', '3ª', '4ª', '5ª'];

		for (let i = 1; i <= maxInstancia; i++) {
			const ordStr = ords[i] ?? `${i}ª`;
			const prazoAnalise = i === 1
				? (isMulti ? (alvara?.prazo_analise_multi1 ?? 60) : (alvara?.prazo_analise_smul1 ?? 60))
				: (isMulti ? (alvara?.prazo_analise_multi2 ?? 60) : (alvara?.prazo_analise_smul2 ?? 60));

			const decisoesInst = decisoes
				.filter((d) => (d.instancia ?? 1) === i && d.publicacao_parecer)
				.sort((a, b) => new Date(b.publicacao_parecer!).getTime() - new Date(a.publicacao_parecer!).getTime());
			const ultimaDecisao = decisoesInst[0];

			let roundLimite: Date | null = null;
			if (i === etapaAtual && status === 2) {
				const limRaw = isMulti
					? processo.data_limiteMulti ?? processo.data_limiteSmul
					: processo.data_limiteSmul;
				roundLimite = limRaw ? new Date(limRaw) : null;
			}

			const anFim = ultimaDecisao?.publicacao_parecer ? new Date(ultimaDecisao.publicacao_parecer) : null;
			const anExcedeu = !!(anFim && roundLimite && anFim > roundLimite);

			let anEstado: EtapaTimeline['estado'];
			if (anFim) anEstado = 'concluida';
			else if (i === etapaAtual && status === 2) anEstado = 'em_andamento';
			else anEstado = 'pendente';

			etapas.push({
				id: `analise-${i}`,
				nome: `${ordStr} Análise`,
				prazo: prazoAnalise,
				descricao: i === 1
					? 'Primeira análise técnica do projeto pela SMUL / interfaces.'
					: `${ordStr} análise técnica do projeto.`,
				estado: anEstado,
				excedeuPrazo: anExcedeu,
				dataLimite: roundLimite ? fmtBr(roundLimite) : undefined,
				conclusao: fmtBr(anFim),
				conclusaoNoPrazo: !anExcedeu,
				progresso: anFim ? 100 : 0,
			});
		}
	}

	// Finalização
	if (status === 3 || conclusao) {
		const concFim = (conclusao ?? processo.conclusao)?.data_conclusao;
		etapas.push({
			id: 'finalizacao',
			nome: 'Finalização',
			descricao: 'Emissão do alvará de aprovação.',
			estado: concFim ? 'concluida' : status === 3 ? 'em_andamento' : 'pendente',
			conclusao: fmtBr(concFim),
			progresso: concFim ? 100 : 0,
		});
	}

	return etapas;
}

function EtapaCard({ etapa, isLast }: { etapa: EtapaTimeline; isLast: boolean }) {
	const isConcluida = etapa.estado === 'concluida';
	const isEmAndamento = etapa.estado === 'em_andamento';

	return (
		<div className='flex gap-4'>
			{/* Conector vertical */}
			<div className='flex flex-col items-center shrink-0 w-8'>
				<div
					className={cn(
						'w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background z-10',
						isConcluida && 'border-green-500',
						isEmAndamento && 'border-primary',
						!isConcluida && !isEmAndamento && 'border-muted-foreground/30',
					)}>
					{isConcluida ? (
						<CheckCircle2 className='w-4 h-4 text-green-500' />
					) : isEmAndamento ? (
						<Clock className='w-4 h-4 text-primary' />
					) : (
						<Circle className='w-4 h-4 text-muted-foreground/30' />
					)}
				</div>
				{!isLast && <div className='w-px flex-1 bg-border mt-1' />}
			</div>

			{/* Card de conteúdo */}
			<div className='flex-1 pb-6'>
				<div className='rounded-lg border bg-card p-4'>
					{/* Cabeçalho: nome + prazo + status */}
					<div className='flex flex-wrap items-center gap-2 mb-1.5'>
						<span className='font-semibold text-sm'>{etapa.nome}</span>
						{etapa.prazo != null && (
							<span className='text-xs text-muted-foreground'>prazo {etapa.prazo} d.u.</span>
						)}
						{isConcluida && (
							<span className='inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium'>
								<Check size={11} /> Concluída
							</span>
						)}
						{isEmAndamento && (
							<span className='inline-flex items-center gap-1 text-xs text-primary font-medium'>
								<Clock size={11} /> Em andamento
							</span>
						)}
						{etapa.excedeuPrazo && (
							<span className='inline-flex items-center gap-1 text-xs text-destructive font-medium'>
								<AlertCircle size={11} /> Excedeu prazo
							</span>
						)}
					</div>

					{/* Descrição */}
					<p className='text-sm text-muted-foreground mb-3'>{etapa.descricao}</p>

					{/* Datas */}
					{(etapa.inicio || etapa.dataLimite || etapa.conclusao) && (
						<div className='flex flex-wrap gap-6 text-xs mb-3'>
							{etapa.inicio && (
								<div>
									<div className='text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5'>Início</div>
									<div className='font-medium'>{etapa.inicio}</div>
								</div>
							)}
							{etapa.dataLimite && (
								<div>
									<div className='text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5'>Data limite</div>
									<div className='font-medium'>{etapa.dataLimite}</div>
								</div>
							)}
							{etapa.conclusao && (
								<div>
									<div className='text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5'>Conclusão</div>
									<div
										className={cn(
											'font-medium',
											etapa.conclusaoNoPrazo !== false
												? 'text-green-600 dark:text-green-400'
												: 'text-destructive',
										)}>
										{etapa.conclusao}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Barra de progresso */}
					{etapa.progresso > 0 && (
						<div className='h-1.5 rounded-full bg-muted overflow-hidden'>
							<div
								className={cn(
									'h-full rounded-full transition-all duration-500',
									etapa.excedeuPrazo ? 'bg-orange-400' : 'bg-green-500',
								)}
								style={{ width: `${etapa.progresso}%` }}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function LinhaDoTempo({
	processo,
	conclusao,
}: {
	processo: IProcesso;
	conclusao: IConclusao | null | undefined;
}) {
	const etapas = buildEtapas(processo, conclusao);
	return (
		<div className='pt-4'>
			{etapas.map((etapa, i) => (
				<EtapaCard key={etapa.id} etapa={etapa} isLast={i === etapas.length - 1} />
			))}
		</div>
	);
}
