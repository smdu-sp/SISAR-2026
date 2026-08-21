/** @format */

import { TableSkeleton } from '@/components/data-table';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as processos from '@/services/processos';
import { IPaginadoProcessos, IProcesso } from '@/types/processos';
import { Suspense } from 'react';
import TabelaProcessos from '../_components/tabela-processos';
import { columns as colProcessos } from './_components/columns';
import { FaseTabs } from './_components/fase-tabs';
import ModalNovoProcesso from './_components/modal-novo-processo';
import { pageContainerComBotaoFlutuante } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ProcessosSuspense({ searchParams }: { searchParams: SearchParams }) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<ProcessosPage searchParams={searchParams} />
		</Suspense>
	);
}

async function ProcessosPage({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;

	return (
		<div className={pageContainerComBotaoFlutuante}>
			<PageHeader title='Processos' />

			<ProcessosConteudo searchParams={params} />
		</div>
	);
}

/* ── Lista de Processos ────────────────────────────────────── */
async function ProcessosConteudo({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	let { pagina = 1, limite = 10, total = 0 } = searchParams;
	const { busca = '', status = '-1' } = searchParams;
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

	return (
		<div className='space-y-4'>
			<TabelaProcessos columns={colProcessos} data={dados}>
				<FaseTabs total={+total} />
			</TabelaProcessos>

			{dados.length > 0 && (
				<Pagination total={+total} pagina={+pagina} limite={+limite} />
			)}

			<div className='absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110'>
				<ModalNovoProcesso />
			</div>
		</div>
	);
}
