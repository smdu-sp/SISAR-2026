/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as admissibilidade from '@/services/admissibilidade';
import {
	IAdmissibilidade,
	IPaginadoAdmissibilidade,
} from '@/types/admissibilidade';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalMotivos from './_components/modal-motivos';

export default function AdmissibilidadeSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<AdmissibilidadePage searchParams={searchParams} />
		</Suspense>
	);
}

async function AdmissibilidadePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '', filtro = '-1' } = await searchParams;
	let dados: IAdmissibilidade[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await admissibilidade.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			+filtro,
			busca as string,
		);

		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoAdmissibilidade;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	const filtroSelect = [
		{ label: 'Todos', value: '-1' },
		{ label: 'Admitidos', value: '0' },
		{ label: 'Em admissão', value: '1' },
		{ label: 'Inadmissíveis', value: '2' },
		{ label: 'Reconsideração', value: '3' },
	];

	return (
		<div className='px-0 md:px-8 relative pb-20 md:pb-14 h-full container mx-auto'>
			<div className='flex items-center justify-between gap-4 flex-wrap'>
				<h1 className='text-xl md:text-4xl font-bold'>Admissibilidade</h1>
				<ModalMotivos />
			</div>
			<div className='grid grid-cols-1 gap-y-3 my-5'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'SEI ou número do processo',
						},
						{
							nome: 'Status',
							tag: 'filtro',
							tipo: 2,
							valores: filtroSelect,
							default: '-1',
						},
					]}
				/>
				<div className='w-full'>
					<DataTable columns={columns} data={dados} />
				</div>
				{dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
		</div>
	);
}
