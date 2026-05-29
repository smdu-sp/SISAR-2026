/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { ColumnDef } from '@tanstack/react-table';
import ModalParecer from './modal-parecer';

export const parecerColumns: ColumnDef<IParecerAdmissibilidade>[] = [
	{
		accessorKey: 'parecer',
		header: 'Parecer',
	},
	{
		accessorKey: 'status',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<Badge variant={row.original.status === 1 ? 'default' : 'secondary'}>
					{row.original.status === 1 ? 'Ativo' : 'Inativo'}
				</Badge>
			</div>
		),
	},
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<ModalParecer item={row.original} isUpdating />
			</div>
		),
	},
];
