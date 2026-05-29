/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { formatarSei, formataProcesso } from '@/lib/utils';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';
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

const TIPO_PROCESSO: Record<number, string> = {
	1: 'Próprio SMUL',
	2: 'Múltiplas Interfaces',
};

function formatarData(valor?: string | Date | null) {
	if (!valor) return '-';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '-';
	return data.toLocaleDateString('pt-BR');
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
		accessorKey: 'processo_fisico',
		header: 'Processo',
		cell: ({ row }) =>
			row.original.processo_fisico
				? formataProcesso(row.original.processo_fisico)
				: '-',
	},
	{
		accessorKey: 'requerimento',
		header: 'Req.',
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
		cell: ({ row }) => formatarData(row.original.alterado_em),
	},
	{
		accessorKey: 'tipo_processo',
		header: 'Tipo',
		cell: ({ row }) =>
			TIPO_PROCESSO[row.original.tipo_processo ?? 1] ?? '-',
	},
];
