/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as unidades from '@/services/unidades';
import { Suspense } from 'react';
import { IPaginadoUnidades, IUnidades } from '@/types/unidades';
import { tipos_unidades } from '@/lib/utils';
import { unidadeColumns } from './_components/unidadeColumns';

export default async function UnidadesSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Unidades searchParams={searchParams} />
		</Suspense>
	);
}

async function Unidades({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	let ok = false;
	const { busca = '', tipo_unidade = 'all' } = await searchParams;
	let dados: IUnidades[] = [];

	const session = await auth();
	if (session && session.access_token) {
		const response = await unidades.buscarTudo(
			session.access_token || '',
			+pagina,
			+limite,
			busca as string,
			tipo_unidade as string,
		);
		const { data } = response;
		ok = response.ok;
		if (ok) {
			if (data) {
				const paginado = data as IPaginadoUnidades;
				pagina = paginado.pagina || 1;
				limite = paginado.limite || 10;
				total = paginado.total || 0;
				dados = paginado.data || [];
			}
		}
	}

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Unidades</h1>
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'busca...',
						},
						{
							nome: 'Status',
							tag: 'tipo_unidade',
							tipo: 2,
							default: 'all',
							valores: tipos_unidades,
						},
					]}
				/>
				<DataTable columns={unidadeColumns} data={dados || []} />

				{dados && dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
		</div>
	);
}
