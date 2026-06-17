/** @format */

'use client';

import { IUsuario } from '@/types/usuario';
import { ColumnDef } from '@tanstack/react-table';
import ModalUpdateCreate from './modal-update-create';
import ModalDelete from './modal-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const columns: ColumnDef<IUsuario>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'login',
		header: 'Usuário',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'status',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={`${status == false ? 'destructive' : 'default'}`}>
						{status ? 'Ativo' : 'Inativo'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
			return (
				<div
					className='flex gap-2 items-center justify-center'
					key={row.id}>
					<Button
						asChild
						size='icon'
						variant='outline'>
						<Link href={`/usuarios/${row.original.id}`}>
							<ExternalLink className='size-4' />
						</Link>
					</Button>
					<ModalUpdateCreate
						user={row.original}
						isUpdating={true}
					/>
					<ModalDelete
						status={!row.original.status}
						id={row.original.id}
					/>
				</div>
			);
		},
	},
];
