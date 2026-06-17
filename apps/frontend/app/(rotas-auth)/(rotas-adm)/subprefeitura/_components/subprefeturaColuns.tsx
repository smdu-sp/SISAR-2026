/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ISubprefeitura } from '@/types/subprefeituras';
import ModalSubprefeitura from './modal-subprefeitura';


export const SubprefeituraColumns: ColumnDef<ISubprefeitura>[] = [
    {
        accessorKey: 'nome',
        header: () => <p className='text-center'>Nome</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.nome}
            </div>
        ),
    },
    {
        accessorKey: 'sigla',
        header: () => <p className='text-center'>Sigla</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.sigla}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: () => <p className='text-left'>Status</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.status}
            </p>
        ),
    },
    {
        id: 'actions',
        header: () => <p className='text-center'>Ações</p>,
        cell: ({ row }) => (
            <div className='flex justify-center'>
                <ModalSubprefeitura item={row.original} isUpdating />
            </div>
        ),
    },
];