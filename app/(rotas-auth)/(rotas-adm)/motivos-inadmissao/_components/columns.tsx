/** @format */

'use client';

import { IMotivoInadmissao } from '@/types/motivos-inadmissao';
import { ColumnDef } from '@tanstack/react-table';
import ModalMotivo from './modal-motivo';

export const motivoColumns: ColumnDef<IMotivoInadmissao>[] = [
	{ accessorKey: 'descricao', header: 'Descrição' },
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<ModalMotivo item={row.original} isUpdating />
			</div>
		),
	},
];
