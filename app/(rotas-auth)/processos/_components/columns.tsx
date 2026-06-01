/** @format */

'use client';

import {
	colunaDataProtocolo,
	colunaDiasPrazoEtapa,
	colunaIdentificadorProcesso,
	colunaTipoAlvara,
} from '@/app/(rotas-auth)/_components/colunas-processo-listagem';
import { Badge } from '@/components/ui/badge';
import { urlProcesso } from '@/lib/processo-navegacao';
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

export const columns: ColumnDef<IProcesso>[] = [
	{
		accessorKey: 'id',
		header: '#',
		cell: ({ row }) => (
			<Link
				href={urlProcesso(row.original.id, row.original.status)}
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
	colunaDataProtocolo(),
	colunaTipoAlvara(),
	colunaDiasPrazoEtapa(),
];
