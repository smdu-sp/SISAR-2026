/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IProcessoGabinetePrefeito } from '@/types/relatorios';

export const gabinetePrefeitoColumn: ColumnDef<IProcessoGabinetePrefeito>[] = [
    {
        accessorKey: 'numero_processo',
        header: () => <p className='text-center'>Nº PROCESSO</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.numero_do_processo || row.original.sei || 'N/A'}
            </div>
        ),
    },
    {
        accessorKey: 'tempo_analise_pedido_inicial',
        header: () => <p className='text-center'>TEMPO DE ANÁLISE PEDIDO INICIAL (dias)</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.tempo_de_analise_pedido_inicial || 0}
            </div>
        ),
    },
    {
        accessorKey: 'categoria_uso',
        header: () => <p className='text-left'>CATEGORIA DE USO</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.requerimento || 'N/A'}
            </p>
        ),
    },
    {
        accessorKey: 'responsavel_projeto',
        header: () => <p className='text-left'>RESPONSÁVEL PELO PROJETO</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.responsavel_tecnico_id || 'N/A'}
            </p>
        ),
    },
    {
        accessorKey: 'empresa',
        header: () => <p className='text-left'>EMPRESA</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.proprietario_id || 'N/A'}
            </p>
        ),
    },
    {
        accessorKey: 'caracteristicas_projeto',
        header: () => <p className='text-left'>CARACTERÍSTICAS PROJETO</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.resumo_projeto || row.original.obs || 'N/A'}
            </p>
        ),
    },
    {
        accessorKey: 'regiao_cidade',
        header: () => <p className='text-center'>REGIÃO DA CIDADE</p>,
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                {row.original.zona || 'N/A'}
            </div>
        ),
    },
]