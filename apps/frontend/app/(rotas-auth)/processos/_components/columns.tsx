/** @format */

'use client';

import {
	colunaDataProtocolo,
	colunaDiasPrazoEtapa,
	colunaIdentificadorProcesso,
	colunaTipoAlvara,
} from '@/app/(rotas-auth)/_components/colunas-processo-listagem';
import { SitPill } from '@/app/(rotas-auth)/_components/deadline-ring';
import { Badge } from '@/components/ui/badge';
import { calcSituacaoPrazo, textoFaseAtual } from '@/lib/listagem-processo';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';

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
	{
		id: 'fase_atual',
		header: 'Fase',
		cell: ({ row }) => (
			<span className='text-xs font-semibold text-foreground/80'>
				{textoFaseAtual(row.original)}
			</span>
		),
	},
	colunaDiasPrazoEtapa(),
	{
		id: 'situacao_prazo',
		header: 'Situação',
		cell: ({ row }) => {
			const situacao = calcSituacaoPrazo(row.original);
			return <SitPill situacao={situacao} small />;
		},
	},
];
