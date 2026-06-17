/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatarSei } from '@/lib/utils';
import {
	dataEnvioAdmissibilidade,
	IAdmissibilidade,
} from '@/types/admissibilidade';
import { ColumnDef } from '@tanstack/react-table';
import { FilePlus, Hand } from 'lucide-react';
import Link from 'next/link';

export const STATUS_ADMISSIBILIDADE: Record<
	number,
	{
		label: string;
		variant: 'default' | 'secondary' | 'destructive' | 'outline';
	}
> = {
	0: { label: 'Admissível', variant: 'default' },
	1: { label: 'Em Análise', variant: 'secondary' },
	2: { label: 'Inadmissível', variant: 'destructive' },
	3: { label: 'Em Reconsideração', variant: 'outline' },
};

function formatarData(valor?: string | Date | null) {
	if (!valor) return '-';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '-';
	return data.toLocaleDateString('pt-BR');
}

function calcularPrazo(
	dataLimite?: string | Date | null,
	status?: number,
): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
	if (status === 0) return { label: 'Admitido', variant: 'secondary' };
	if (status === 2) return { label: 'Sem prazo', variant: 'secondary' };
	if (!dataLimite) return { label: '-', variant: 'outline' };

	const limite = new Date(dataLimite);
	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);
	limite.setHours(0, 0, 0, 0);
	const diffDays = Math.ceil(
		(limite.getTime() - hoje.getTime()) / (1000 * 3600 * 24),
	);

	if (diffDays >= 0) {
		const variant =
			diffDays <= 5
				? 'destructive'
				: diffDays <= 9
					? 'default'
					: 'secondary';
		return { label: `${diffDays} dias restantes`, variant };
	}
	return { label: 'Em atraso', variant: 'destructive' };
}

export function createColumns(
	onInadmitir: (inicialId: number, sei: string) => void,
): ColumnDef<IAdmissibilidade>[] {
	return [
		{
			accessorKey: 'inicial_id',
			header: '#',
			cell: ({ row }) => (
				<Link
					href={`/processos/${row.original.inicial_id}`}
					className='font-medium text-primary hover:underline'>
					{row.original.inicial_id}
				</Link>
			),
		},
		{
			id: 'sei',
			header: 'SEI',
			cell: ({ row }) =>
				row.original.inicial?.sei
					? formatarSei(row.original.inicial.sei)
					: '-',
		},
		{
			id: 'envio',
			header: 'Data envio',
			cell: ({ row }) =>
				formatarData(dataEnvioAdmissibilidade(row.original)),
		},
		{
			accessorKey: 'criado_em',
			header: 'Data criação',
			cell: ({ row }) => formatarData(row.original.criado_em),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const config =
					STATUS_ADMISSIBILIDADE[row.original.status] ??
					STATUS_ADMISSIBILIDADE[1];
				return <Badge variant={config.variant}>{config.label}</Badge>;
			},
		},
		{
			id: 'prazo',
			header: 'Prazo',
			cell: ({ row }) => {
				const prazo = calcularPrazo(
					row.original.inicial?.data_limiteSmul,
					row.original.status,
				);
				return <Badge variant={prazo.variant}>{prazo.label}</Badge>;
			},
		},
		{
			id: 'acoes',
			header: () => <p className='text-center'>Ações</p>,
			cell: ({ row }) => {
				const { status, inicial_id, inicial } = row.original;
				if (status === 0) return null;

				return (
					<div
						className='flex gap-2 items-center justify-center'
						onClick={(e) => e.stopPropagation()}>
						{status !== 2 && status !== 3 && (
							<Button
								type='button'
								size='icon'
								variant='outline'
								className='text-amber-600 hover:text-amber-700'
								title='Inadmitir'
								onClick={() =>
									onInadmitir(inicial_id, inicial?.sei ?? '')
								}>
								<Hand className='h-4 w-4' />
							</Button>
						)}
						<Button
							type='button'
							size='icon'
							variant='outline'
							className='text-green-600 hover:text-green-700'
							title='Admitir'
							asChild>
							<Link
								href={`/processos/${inicial_id}?tab=admissibilidade&from=admissibilidade`}>
								<FilePlus className='h-4 w-4' />
							</Link>
						</Button>
					</div>
				);
			},
		},
	];
}
