/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { IRelatorioARProgressaoMensal } from '@/types/relatorios';
import { IListaARProgressaoMensal } from '@/types/relatorios';


export const ProgressaoMensalColumn: ColumnDef<IListaARProgressaoMensal>[] = [
    {
        accessorKey: 'ano',
        header: () => <p className='text-center'>Ano</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.ano}
            </div>
        ),
    },
    {
        accessorKey: 'mes',
        header: () => <p className='text-center'>Mês</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.mes}
            </div>
        ),
    },
    {
        accessorKey: 'mensal',
        header: () => <p className='text-left'>Mensal</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.mensal}
            </p>
        ),
    },
    {
        accessorKey: 'acumulado',
        header: () => <p className='text-left'>Acumulado</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.acc}
            </p>
        ),
    },
];