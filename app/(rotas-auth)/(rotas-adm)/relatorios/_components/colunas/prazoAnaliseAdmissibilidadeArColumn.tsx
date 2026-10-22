/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IAdmissibilidadesAnalise } from '@/types/relatorios';


export const prazoAnaliseAdmissibilidadeArColumn: ColumnDef<IAdmissibilidadesAnalise>[] = [
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
                {row.original.processo_fisico || row.original.sei || row.original.aprova_digital}
            </p>
        ),
    },
    {
        accessorKey: 'data do protocolo',
        header: () => <p className='text-left'>Data do Protocolo</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {new Date(row.original.data_protocolo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
        ),
    },
    {
        accessorKey: 'data da publicação',
        header: () => <p className='text-left'>Data da Publicação</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {new Date(row.original.envio_admissibilidade).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
        ),
    },
    {
        accessorKey: 'pedido de reconsideração',
        header: () => <p className='text-left'>Pedido de Reconsideração</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.reconsiderado ? 'Sim' : 'Não'}
            </p>
        ),
    },
    {
        accessorKey: 'tempo de análise de admissibilidade (1ª análise)',
        header: () => <p className='text-left'>Tempo de Análise de Admissibilidade (1ª Análise)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.tempo_de_analise_admissibilidade ? row.original.tempo_de_analise_admissibilidade : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'tempo de análise de admissibilidade (2ª análise)',
        header: () => <p className='text-left'>Tempo de Análise de Admissibilidade (2ª Análise)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.tempo_de_analise_reconsideracao ? row.original.tempo_de_analise_reconsideracao : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'suspensão do prazo durante análise (1ª análise)',
        header: () => <p className='text-left'>Suspensão do Prazo Durante Análise (1ª Análise)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.suspensao_prazo_etapa_1 ? row.original.suspensao_prazo_etapa_1 : "N/A"}
            </p>
        ),
    },
    {
        accessorKey: 'suspensão do prazo durante análise (2ª análise)',
        header: () => <p className='text-left'>Suspensão do Prazo Durante Análise (2ª Análise)</p>,
        cell: ({ row }) => (
            <p className='flex text-left'>
                {row.original.suspensao_prazo_etapa_2 ? row.original.suspensao_prazo_etapa_2 : "N/A"}
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


];