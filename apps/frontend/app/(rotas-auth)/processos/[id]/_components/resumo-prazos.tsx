/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
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
import { AlertTriangle, CheckCircle2, Clock, Minus } from 'lucide-react';

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
			<CardContent className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
				{FASES.map(({ fase, nome }) => {
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
						<div
							key={fase}
							className={cn(
								'flex items-start gap-3 rounded-lg border p-3',
								atual && 'border-primary/50 bg-primary/5',
							)}>
							<div
								className={cn(
									'mt-0.5 rounded-md p-1.5 shrink-0',
									info.variant === 'destructive' &&
										'bg-destructive/10 text-destructive',
									info.variant === 'default' && 'bg-primary/10 text-primary',
									(info.variant === 'secondary' ||
										info.variant === 'outline') &&
										'bg-muted text-muted-foreground',
								)}>
								<Icon className='h-4 w-4' aria-hidden />
							</div>
							<div className='min-w-0 space-y-0.5'>
								<div className='flex items-center gap-2 flex-wrap'>
									<p className='text-sm font-medium'>{nome}</p>
									{atual && (
										<Badge variant='outline' className='text-[10px]'>
											Atual
										</Badge>
									)}
								</div>
								<p className='text-sm font-semibold tracking-tight'>
									{info.mensagem}
								</p>
								<p className='text-xs text-muted-foreground'>
									{info.detalhe ?? ESTADO_LABEL[info.estado] ?? info.estado}
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
