/** @format */

'use client';

import { ICategoria } from '@/types/categorias';
import { ColumnDef } from '@tanstack/react-table';
import ModalCategoria from './modal-categoria';

export const categoriaColumns: ColumnDef<ICategoria>[] = [
	{ accessorKey: 'categoria', header: 'Categoria' },
	{ accessorKey: 'divisao', header: 'Divisão' },
	{ accessorKey: 'competencia', header: 'Competência' },
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center gap-2'>
				<ModalCategoria item={row.original} isUpdating />
			</div>
		),
	},
];
