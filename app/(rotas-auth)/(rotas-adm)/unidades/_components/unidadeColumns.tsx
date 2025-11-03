/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Colegiados, IPublicacao, Tipos_Documento } from '@/types/publicacao';
import { format } from 'date-fns';
import { capitalize, formataProcesso } from '@/lib/utils';
import { IUnidades } from '@/types/unidades';



export const unidadeColumns: ColumnDef<IUnidades>[] = [
    {
        accessorKey: 'codigo',
        header: () => <p className='text-left'>Código</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.codigo}
            </p>
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
        accessorKey: 'nome',
        header: () => <p className='text-center'>Nome</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.nome}
            </div>
        ),
    },
];