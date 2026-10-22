/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IAlvaras } from '@/types/alvaras';
import { calcularPrazoTotalAnalise } from '@/lib/prazos-alvara';
import ModalPrazosAlvara from './modal-prazos-alvara';
import { Badge } from '@/components/ui/badge';

export const AlvarasColumns: ColumnDef<IAlvaras>[] = [
	{
		accessorKey: 'nome',
		header: () => (
			<p className='text-left w-[260px] min-w-[220px]'>Tipo de alvará</p>
		),
		cell: ({ row }) => (
			<p className='text-left font-medium w-[260px] min-w-[220px] whitespace-normal break-words leading-snug'>
				{row.original.nome}
			</p>
		),
	},
	{
		accessorKey: 'prazo_analise_smul1',
		header: () => (
			<p className='text-center whitespace-nowrap'>1ª Análise SMUL</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_analise_smul1}</p>
		),
	},
	{
		accessorKey: 'prazo_analise_smul2',
		header: () => (
			<p className='text-center whitespace-nowrap'>2ª Análise SMUL</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_analise_smul2}</p>
		),
	},
	{
		accessorKey: 'prazo_analise_multi1',
		header: () => (
			<p className='text-center whitespace-nowrap'>1ª Análise Múltiplas</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_analise_multi1}</p>
		),
	},
	{
		accessorKey: 'prazo_analise_multi2',
		header: () => (
			<p className='text-center whitespace-nowrap'>2ª Análise Múltiplas</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_analise_multi2}</p>
		),
	},
	{
		accessorKey: 'prazo_admissibilidade_smul',
		header: () => (
			<p className='text-center whitespace-nowrap'>Adm. + outros</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_admissibilidade_smul}</p>
		),
	},
	{
		id: 'total',
		header: () => (
			<p className='text-center whitespace-nowrap font-semibold'>Total análise</p>
		),
		cell: ({ row }) => (
			<p className='text-center font-semibold'>
				{calcularPrazoTotalAnalise(row.original)}
			</p>
		),
	},
	{
		accessorKey: 'prazo_comunique_se',
		header: () => (
			<p className='text-center whitespace-nowrap'>1º comunique-se</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_comunique_se}</p>
		),
	},
	{
		accessorKey: 'prazo_encaminhar_coord',
		header: () => (
			<p className='text-center whitespace-nowrap'>2º comunique-se</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_encaminhar_coord}</p>
		),
	},
	{
		accessorKey: 'prazo_emissao_alvara_smul',
		header: () => (
			<p className='text-center whitespace-nowrap'>Emissão (dias)</p>
		),
		cell: ({ row }) => (
			<p className='text-center'>{row.original.prazo_emissao_alvara_smul}</p>
		),
	},
	{
		accessorKey: 'status',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<Badge variant={row.original.status === 1 ? 'default' : 'secondary'}>
					{row.original.status === 1 ? 'Ativo' : 'Inativo'}
				</Badge>
			</div>
		),
	},
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex justify-center'>
				<ModalPrazosAlvara item={row.original} isUpdating />
			</div>
		),
	},
];
