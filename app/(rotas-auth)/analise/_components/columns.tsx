/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatarSei } from '@/lib/utils';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const STATUS_PROCESSO: Record<
	number,
	{ label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
	0: { label: 'Admissibilidade', variant: 'secondary' },
	1: { label: 'Via Ordinária', variant: 'outline' },
	2: { label: 'Em Análise', variant: 'default' },
	3: { label: 'Deferido', variant: 'default' },
	4: { label: 'Indeferido', variant: 'destructive' },
};

const TIPO_REQUERIMENTO: Record<number, string> = {
	1: 'IPTU',
	2: 'INCRA',
	3: 'Área Pública',
};

const TIPO_PROCESSO: Record<
	number,
	{ label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
	0: { label: '-', variant: 'outline' },
	1: { label: 'Próprio SMUL', variant: 'secondary' },
	2: { label: 'Múltiplas Interfaces', variant: 'default' },
};

function formatarData(valor?: string | Date | null) {
	if (!valor) return '-';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '-';
	return data.toLocaleDateString('pt-BR');
}

function formatarDataHora(valor?: string | Date | null) {
	if (!valor) return '-';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '-';
	return data.toLocaleString('pt-BR');
}

export const columns: ColumnDef<IProcesso>[] = [
	{
		accessorKey: 'id',
		header: '#',
		cell: ({ row }) => (
			<Link
				href={`/processos/${row.original.id}`}
				className='font-medium text-primary hover:underline'>
				{row.original.id}
			</Link>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status ?? 0;
			const config = STATUS_PROCESSO[status] ?? STATUS_PROCESSO[0];
			return <Badge variant={config.variant}>{config.label}</Badge>;
		},
	},
	{
		accessorKey: 'sei',
		header: 'SEI',
		cell: ({ row }) => (
			<Link
				href={`/processos/${row.original.id}`}
				className='hover:underline'>
				{formatarSei(row.original.sei)}
			</Link>
		),
	},
	{
		accessorKey: 'tipo_requerimento',
		header: () => (
			<span title='Tipo de Requerimento'>Tipo Req.</span>
		),
		cell: ({ row }) =>
			TIPO_REQUERIMENTO[row.original.tipo_requerimento] ??
			String(row.original.tipo_requerimento ?? '-'),
	},
	{
		accessorKey: 'requerimento',
		header: 'Requerimento',
	},
	{
		accessorKey: 'data_protocolo',
		header: 'Protocolo',
		cell: ({ row }) => formatarData(row.original.data_protocolo),
	},
	{
		id: 'alvara_tipo',
		header: 'Tipo de Alvará',
		cell: ({ row }) => row.original.alvara_tipo?.nome ?? '-',
	},
	{
		accessorKey: 'alterado_em',
		header: 'Última alteração',
		cell: ({ row }) => formatarDataHora(row.original.alterado_em),
	},
	{
		accessorKey: 'tipo_processo',
		header: 'Tipo de Processo',
		cell: ({ row }) => {
			const config =
				TIPO_PROCESSO[row.original.tipo_processo ?? 0] ??
				TIPO_PROCESSO[0];
			return <Badge variant={config.variant}>{config.label}</Badge>;
		},
	},
	{
		id: 'acoes',
		header: () => <span className='sr-only'>Ações</span>,
		cell: ({ row }) => (
			<div className='text-right'>
				<Button
					size='icon'
					variant='ghost'
					className='text-sky-600 hover:text-sky-700'
					title='Abrir análise'
					asChild>
					<Link
						href={`/processos/${row.original.id}?tab=analise&from=analise`}>
						<Sparkles className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		),
	},
];
