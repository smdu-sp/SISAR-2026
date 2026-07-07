/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as parecerAdmissibilidade from '@/services/parecer-admissibilidade';
import {
	IPaginadoParecerAdmissibilidade,
	IParecerAdmissibilidade,
} from '@/types/parecer-admissibilidade';
import { Suspense } from 'react';
import { parecerColumns } from './_components/columns';
import ModalParecer from './_components/modal-parecer';
import { BotaoCadastroFlutuante } from '@/components/cadastro/cadastro-lista';
import { PageHeader } from '@/components/page-header';
import { pageContainerComBotaoFlutuante } from '@/lib/utils';

export default function ParecerAdmissibilidadeSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<ParecerAdmissibilidadePage searchParams={searchParams} />
		</Suspense>
	);
}

async function ParecerAdmissibilidadePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: IParecerAdmissibilidade[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await parecerAdmissibilidade.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			busca as string,
		);
		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoParecerAdmissibilidade;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	return (
		<div className={pageContainerComBotaoFlutuante}>
			<PageHeader title='Pareceres de Admissibilidade' />
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Buscar parecer...',
						},
					]}
				/>
				<DataTable columns={parecerColumns} data={dados} />
				{dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
			<BotaoCadastroFlutuante>
				<ModalParecer />
			</BotaoCadastroFlutuante>
		</div>
	);
}
