/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IAlvarasTipos } from '@/types/alvaras';

export const AlvarasColumns: ColumnDef<IAlvarasTipos>[] = [
    {
        accessorKey: 'nome',
        header: () => <p className='text-left'>Nome</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.nome}
            </p>
        ),
    },
    {
        accessorKey: 'admissibilidade',
        header: () => <p className='text-center'>Admissibilidade</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.admissibilidade}
            </div>
        ),
    },
    {
        accessorKey: 'analise1',
        header: () => <p className='text-center'>1ª Análise SMUL</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.analise1}
            </div>
        ),
    },
    {
        accessorKey: 'analise2',
        header: () => <p className='text-center'>2ª Análise SMUL</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.analise2}
            </div>
        ),
    },
    {
        accessorKey: 'analiseMult1',
        header: () => <p className='text-center'>1ª Análise Múltiplas</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.analiseMult1}
            </div>
        ),
    },
    {
        accessorKey: 'analiseMult2',
        header: () => <p className='text-center'>2ª Análise Múltiplas</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.analiseMult2}
            </div>
        ),
    },
];