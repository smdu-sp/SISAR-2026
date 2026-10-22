/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
	calcularPrazoFase,
	FasePrazoProcesso,
} from '@/lib/prazo-fase';
import { cn } from '@/lib/utils';
import { IAdmissibilidade } from '@/types/admissibilidade';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import { AlertTriangle, CalendarClock, CheckCircle2, Clock } from 'lucide-react';

const ESTADO_LABEL: Record<string, string> = {
	pendente: 'Pendente',
	em_andamento: 'Em andamento',
	finalizada: 'Finalizada',
	sem_prazo: '—',
};

export default function CardPrazoFase({
	fase,
	processo,
	admissibilidade,
	conclusao,
	className,
}: {
	fase: FasePrazoProcesso;
	processo: IProcesso;
	admissibilidade?: IAdmissibilidade | null;
	conclusao?: IConclusao | null;
	className?: string;
}) {
	const info = calcularPrazoFase(fase, processo, {
		admissibilidade,
		conclusao,
	});

	const Icon =
		info.estado === 'finalizada'
			? CheckCircle2
			: info.variant === 'destructive'
				? AlertTriangle
				: Clock;

	return (
		<Card className={cn('border-dashed', className)}>
			<CardContent className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-start gap-3 min-w-0'>
					<div
						className={cn(
							'rounded-md p-2 shrink-0',
							info.variant === 'destructive' &&
								'bg-destructive/10 text-destructive',
							info.variant === 'default' && 'bg-primary/10 text-primary',
							info.variant === 'secondary' &&
								'bg-muted text-muted-foreground',
							info.variant === 'outline' && 'bg-muted/50 text-muted-foreground',
						)}>
						<Icon className='h-5 w-5' aria-hidden />
					</div>
					<div className='min-w-0 space-y-1'>
						<div className='flex items-center gap-2 flex-wrap'>
							<p className='text-sm font-medium flex items-center gap-1.5'>
								<CalendarClock className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
								{info.titulo}
							</p>
							<Badge variant={info.variant} className='text-xs'>
								{ESTADO_LABEL[info.estado] ?? info.estado}
							</Badge>
						</div>
						<p className='text-2xl font-semibold tracking-tight'>
							{info.mensagem}
						</p>
						{info.detalhe ? (
							<p className='text-sm text-muted-foreground'>{info.detalhe}</p>
						) : null}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
