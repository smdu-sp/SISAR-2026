/** @format */

'use client';

import { IPedido } from '@/types/pedidos';
import { ColumnDef } from '@tanstack/react-table';
import ModalPedido from './modal-pedido';

export const pedidoColumns: ColumnDef<IPedido>[] = [
	{ accessorKey: 'descricao', header: 'Descrição' },
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<ModalPedido item={row.original} isUpdating />
			</div>
		),
	},
];
