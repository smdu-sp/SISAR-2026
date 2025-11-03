/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IAdmissibilidadesAnalise } from '@/types/relatorios';

export const prazoAnaliseAdmissibilidadeRrColumn: ColumnDef<IAdmissibilidadesAnalise>[] = [
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
        accessorKey: 'número processo SIMPROC',
        header: () => <p className='text-left'>Número Processo SIMPROC</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.sei || row.original.processo_fisico || row.original.aprova_digital}
            </p>
        ),
    },
    {
        accessorKey: 'data do protocolo',
        header: () => <p className='text-left'>Data do Protocolo</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.data_protocolo}
            </p>
        ),
    },
    {
        accessorKey: 'data da publicação',
        header: () => <p className='text-left'>Data da Publicação</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.envio_admissibilidade as string}
            </p>
        ),
    },
    {
        accessorKey: 'tempo de análise de admissibilidade (1ª análise)',
        header: () => <p className='text-left'>tempo de análise de admissibilidade (1ª análise)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.tempo_de_analise_admissibilidade ? row.original.tempo_de_analise_admissibilidade : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'tempo de análise de admissibilidade (reconsideração)',
        header: () => <p className='text-left'>tempo de análise de admissibilidade (reconsideração)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.tempo_de_analise_reconsideracao ? row.original.tempo_de_analise_reconsideracao : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'suspensão do prazo durante análise (em dias)',
        header: () => <p className='text-left'>Suspensão do Prazo Durante Análise (em dias)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.suspensao_prazo_etapa_1 && row.original.suspensao_prazo_etapa_2 ? row.original.suspensao_prazo_etapa_1 + row.original.suspensao_prazo_etapa_2 : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'motivo da suspensão',
        header: () => <p className='text-left'>motivo da suspensão</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.motivos_suspensao ? row.original.motivos_suspensao.join(", ") : "N/A"}
            </p>
        ),
    },

]