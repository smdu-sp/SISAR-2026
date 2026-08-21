/** @format */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	calcularPrazoFase,
	FasePrazoProcesso,
	inferirFasePrazoAtual,
} from '@/lib/prazo-fase';
import { cn } from '@/lib/utils';
import { IAdmissibilidade } from '@/types/admissibilidade';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import {
	AlertTriangle,
	CheckCircle2,
	ChevronRight,
	Clock,
	Minus,
} from 'lucide-react';
import { Fragment } from 'react';

const FASES: { fase: FasePrazoProcesso; nome: string }[] = [
	{ fase: 'dados', nome: 'Dados iniciais' },
	{ fase: 'distribuicao', nome: 'Distribuição' },
	{ fase: 'admissibilidade', nome: 'Admissibilidade' },
	{ fase: 'analise', nome: 'Análise técnica' },
	{ fase: 'finalizacao', nome: 'Finalização' },
];

const ESTADO_LABEL: Record<string, string> = {
	pendente: 'Pendente',
	em_andamento: 'Em andamento',
	finalizada: 'Finalizada',
	sem_prazo: '—',
};

export default function ResumoPrazos({
	processo,
	admissibilidade,
	conclusao,
}: {
	processo: IProcesso;
	admissibilidade?: IAdmissibilidade | null;
	conclusao?: IConclusao | null;
}) {
	const faseAtual = inferirFasePrazoAtual(processo);

	return (
		<Card className='mb-6'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-base'>Prazos por etapa</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Linha do tempo horizontal (rola no mobile) */}
				<div className='overflow-x-auto pb-1'>
					<div className='flex items-stretch gap-1 min-w-max'>
						{FASES.map(({ fase, nome }, i) => {
							const info = calcularPrazoFase(fase, processo, {
								admissibilidade,
								conclusao,
							});
							const atual = fase === faseAtual;
							const Icon =
								info.estado === 'finalizada'
									? CheckCircle2
									: info.estado === 'sem_prazo' || info.estado === 'pendente'
										? Minus
										: info.variant === 'destructive'
											? AlertTriangle
											: Clock;
							return (
								<Fragment key={fase}>
									<div
										className={cn(
											'shrink-0 w-[240px] rounded-lg border p-3.5',
											atual && 'border-primary/60 bg-primary/5',
										)}>
										<div className='flex items-center gap-2 mb-1.5'>
											<span
												className={cn(
													'rounded-md p-1 shrink-0',
													info.variant === 'destructive' &&
														'bg-destructive/10 text-destructive',
													info.variant === 'default' &&
														'bg-primary/10 text-primary',
													(info.variant === 'secondary' ||
														info.variant === 'outline') &&
														'bg-muted text-muted-foreground',
												)}>
												<Icon className='h-3.5 w-3.5' aria-hidden />
											</span>
											<p className='text-xs font-semibold truncate'>{nome}</p>
										</div>
										<p className='text-sm font-semibold tracking-tight leading-snug'>
											{info.mensagem}
										</p>
										<p className='text-[11px] text-muted-foreground mt-0.5'>
											{ESTADO_LABEL[info.estado] ?? info.estado}
											{atual && ' · Atual'}
										</p>
									</div>
									{i < FASES.length - 1 && (
										<div className='flex items-center shrink-0'>
											<ChevronRight
												className='h-5 w-5 text-muted-foreground/50'
												aria-hidden
											/>
										</div>
									)}
								</Fragment>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
