/** @format */

import { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as processos from '@/services/processos';
import * as publicacao from '@/services/publicacoes';
import { IPaginadoProcessos, IProcesso } from '@/types/processos';
import { IPaginadoPublicacao, IPublicacao } from '@/types/publicacao';
import { Suspense } from 'react';
import TabelaProcessos from '../_components/tabela-processos';
import DataTable from '@/components/data-table';
import { columns as colProcessos } from './_components/columns';
import { columns as colPublicacoes } from '../_components/columns';
import { FaseTabs } from './_components/fase-tabs';
import { AbasProcessos } from './_components/abas-processos';
import ModalNovoProcesso from './_components/modal-novo-processo';
import ModalUpdateAndCreate from '../_components/modal-update-create';
import { colegiados, tipos_documento } from '@/lib/utils';

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
	const aba = (params.aba as string) ?? 'processos';

	return (
		<div className='px-0 md:px-8 relative pb-20 md:pb-14 min-h-full container mx-auto'>
			<h1 className='text-xl md:text-2xl font-extrabold mb-5'>Processos</h1>

			<AbasProcessos aba={aba} />

			{aba === 'publicacoes' ? (
				<Suspense fallback={<TableSkeleton />}>
					<PublicacoesConteudo searchParams={params} />
				</Suspense>
			) : (
				<Suspense fallback={<TableSkeleton />}>
					<ProcessosConteudo searchParams={params} />
				</Suspense>
			)}
		</div>
	);
}

/* ── Aba Processos ─────────────────────────────────────────── */
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

/* ── Aba Publicações ───────────────────────────────────────── */
async function PublicacoesConteudo({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	let { pagina = 1, limite = 10, total = 0 } = searchParams;
	const {
		busca = '',
		tipo_documento = 'all',
		colegiado = 'all',
	} = searchParams;
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
		<div className='space-y-4'>
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
