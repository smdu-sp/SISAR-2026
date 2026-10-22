/** @format */

'use client';

import {
	colunaDataProtocolo,
	colunaDiasPrazoEtapa,
	colunaIdentificadorProcesso,
	colunaTipoAlvara,
} from '@/app/(rotas-auth)/_components/colunas-processo-listagem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
	colunaIdentificadorProcesso(),
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
	colunaDataProtocolo(),
	colunaTipoAlvara(),
	{
		id: 'tecnico',
		header: 'Técnico',
		cell: ({ row }) =>
			row.original.distribuicao?.tecnico_responsavel?.nome ?? '-',
	},
	colunaDiasPrazoEtapa(),
	{
		id: 'acoes',
		header: () => <span className='sr-only'>Ações</span>,
		cell: ({ row }) => (
			<div className='text-right'>
				<Button
					size='icon'
					variant='ghost'
					className='text-sky-600 hover:text-sky-700'
					title='Abrir análise técnica'
					asChild>
					<Link
						href={`/processos/${row.original.id}?tab=analise&from=analise`}
						title='Análise técnica'>
						<Sparkles className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		),
	},
];
