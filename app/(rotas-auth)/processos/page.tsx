/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as processos from '@/services/processos';
import { IPaginadoProcessos, IProcesso } from '@/types/processos';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalNovoProcesso from './_components/modal-novo-processo';

export default function ProcessosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<ProcessosPage searchParams={searchParams} />
		</Suspense>
	);
}

async function ProcessosPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '', status = '-1' } = await searchParams;
	let dados: IProcesso[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await processos.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			busca as string,
			status as string,
		);

		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoProcessos;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	const statusSelect = [
		{ label: 'Todos', value: '-1' },
		{ label: 'Admissibilidade', value: '0' },
		{ label: 'Via Ordinária', value: '1' },
		{ label: 'Em Análise', value: '2' },
		{ label: 'Deferido', value: '3' },
		{ label: 'Indeferido', value: '4' },
	];

	return (
		<div className='px-0 md:px-8 relative pb-20 md:pb-14 h-full container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Processos</h1>
			<div className='grid grid-cols-1 gap-y-3 my-5'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'SEI, requerimento ou processo',
						},
						{
							nome: 'Status',
							tag: 'status',
							tipo: 2,
							valores: statusSelect,
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
			<div className='absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110'>
				<ModalNovoProcesso />
			</div>
		</div>
	);
}
