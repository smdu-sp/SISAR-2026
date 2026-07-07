/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { BotaoCadastroFlutuante } from '@/components/cadastro/cadastro-lista';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { auth } from '@/lib/auth/auth';
import { pageContainerComBotaoFlutuante } from '@/lib/utils';
import * as pedidos from '@/services/pedidos';
import { IPaginadoPedidos, IPedido } from '@/types/pedidos';
import { Suspense } from 'react';
import { pedidoColumns } from './_components/columns';
import ModalPedido from './_components/modal-pedido';

export default function PedidosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<PedidosPage searchParams={searchParams} />
		</Suspense>
	);
}

async function PedidosPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: IPedido[] = [];

	const session = await auth();
	if (session?.access_token) {
		const response = await pedidos.buscarTudo(
			session.access_token,
			+pagina,
			+limite,
			busca as string,
		);
		if (response.ok && response.data) {
			const paginado = response.data as IPaginadoPedidos;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	return (
		<div className={pageContainerComBotaoFlutuante}>
			<PageHeader title='Tipos de Pedido' />
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{ nome: 'Busca', tag: 'busca', tipo: 0, placeholder: 'Buscar pedido...' },
					]}
				/>
				<DataTable columns={pedidoColumns} data={dados} />
				{dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
			<BotaoCadastroFlutuante>
				<ModalPedido />
			</BotaoCadastroFlutuante>
		</div>
	);
}
