/** @format */

import { BotaoCadastroFlutuante } from '@/components/cadastro/cadastro-lista';
import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as alvaras from '@/services/alvaras';
import { IAlvaras, IPaginadoAlvaras } from '@/types/alvaras';
import { Suspense } from 'react';
import { AlvarasColumns } from './_components/alvarasColumns';
import ModalPrazosAlvara from './_components/modal-prazos-alvara';

export default function PrazosAlvaraSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<PrazosAlvaraPage searchParams={searchParams} />
		</Suspense>
	);
}

async function PrazosAlvaraPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 20, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: IAlvaras[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await alvaras.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			busca as string,
		);
		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoAlvaras;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 20;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Prazos por tipo de alvará</h1>
			<p className='text-sm text-muted-foreground mt-1 max-w-3xl'>
				Cadastre e consulte os prazos em dias por etapa de análise. O total de
				análise é calculado automaticamente (soma das cinco etapas da matriz).
			</p>
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Buscar tipo de alvará...',
						},
					]}
				/>
				<div className='overflow-x-auto w-full'>
					<DataTable columns={AlvarasColumns} data={dados} />
				</div>
				{dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
			<BotaoCadastroFlutuante>
				<ModalPrazosAlvara />
			</BotaoCadastroFlutuante>
		</div>
	);
}
