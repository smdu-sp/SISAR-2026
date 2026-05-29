/** @format */

'use client';

import { ICoordenadoria } from '@/types/coordenadorias';
import { ColumnDef } from '@tanstack/react-table';
import ModalCoordenadoria from './modal-coordenadoria';

export const coordenadoriaColumns: ColumnDef<ICoordenadoria>[] = [
	{ accessorKey: 'sigla', header: 'Sigla' },
	{ accessorKey: 'nome', header: 'Nome' },
	{
		accessorKey: 'diretorias',
		header: 'Diretorias',
		cell: ({ row }) => row.original.diretorias?.length ?? 0,
	},
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<ModalCoordenadoria item={row.original} isUpdating />
			</div>
		),
	},
];
