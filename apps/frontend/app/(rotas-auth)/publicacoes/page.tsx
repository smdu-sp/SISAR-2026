/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { auth } from '@/lib/auth/auth';
import { colegiados, tipos_documento, pageContainerComBotaoFlutuante } from '@/lib/utils';
import * as publicacao from '@/services/publicacoes';
import { IPaginadoPublicacao, IPublicacao } from '@/types/publicacao';
import { Suspense } from 'react';
import { columns as colPublicacoes } from '../_components/columns';
import ModalUpdateAndCreate from '../_components/modal-update-create';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function PublicacoesSuspense({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<PublicacoesPage searchParams={searchParams} />
		</Suspense>
	);
}

async function PublicacoesPage({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	let { pagina = 1, limite = 10, total = 0 } = params;
	const {
		busca = '',
		tipo_documento = 'all',
		colegiado = 'all',
	} = params;
	let dados: IPublicacao[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await publicacao.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			busca as string,
			tipo_documento as string,
			colegiado as string,
		);

		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoPublicacao;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	return (
		<div className={pageContainerComBotaoFlutuante}>
			<PageHeader title='Publicações' />

			<Filtros
				camposFiltraveis={[
					{
						nome: 'Busca',
						tag: 'busca',
						tipo: 0,
						placeholder: 'Número do processo',
					},
					{
						nome: 'Tipo',
						tag: 'tipo_documento',
						tipo: 2,
						default: 'all',
						valores: tipos_documento,
					},
					{
						nome: 'Colegiado',
						tag: 'colegiado',
						tipo: 2,
						default: 'all',
						valores: colegiados,
					},
				]}
			/>

			<DataTable columns={colPublicacoes} data={dados} />

			{dados.length > 0 && (
				<Pagination total={+total} pagina={+pagina} limite={+limite} />
			)}

			<div className='absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110'>
				<ModalUpdateAndCreate isUpdating={false} />
			</div>
		</div>
	);
}
