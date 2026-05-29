/** @format */

'use client';

import { ICoordenadoriaSelect } from '@/types/coordenadorias';
import { IDiretoria } from '@/types/diretorias';
import { ColumnDef } from '@tanstack/react-table';
import ModalDiretoria from './modal-diretoria';

export function getDiretoriaColumns(
	coordenadorias: ICoordenadoriaSelect[],
): ColumnDef<IDiretoria>[] {
	return [
		{ accessorKey: 'nome', header: 'Nome' },
		{
			accessorKey: 'coordenadoria',
			header: 'Coordenadoria',
			cell: ({ row }) =>
				row.original.coordenadoria
					? `${row.original.coordenadoria.sigla} - ${row.original.coordenadoria.nome}`
					: '-',
		},
		{
			id: 'actions',
			header: () => <p className='text-center'>Ações</p>,
			cell: ({ row }) => (
				<div className='flex justify-center'>
					<ModalDiretoria
						item={row.original}
						isUpdating
						coordenadorias={coordenadorias}
					/>
				</div>
			),
		},
	];
}
