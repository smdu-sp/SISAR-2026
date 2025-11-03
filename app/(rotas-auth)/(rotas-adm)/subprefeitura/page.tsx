/** @format */

import DataTable from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import { auth } from '@/lib/auth/auth';
import { SubprefeituraColumns } from './_components/subprefeturaColuns';
import { IPaginadoSubprefeituras, ISubprefeitura } from '@/types/subprefeituras';
import * as subprefeitura from "../../../../services/subprefeituras";
import { tipos_subprefeituras } from '@/lib/utils';
import Pagination from '@/components/pagination';

import React from 'react';

export default async function SubprefeituraPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	let ok = false;
	const { busca = '', tipo_subprefeitura = 'all' } = await searchParams;
	let dados: ISubprefeitura[] = [];

	const session = await auth();
	if (session && session.access_token) {
		const response = await subprefeitura.buscarTudo(
			session.access_token || '',
			+pagina,
			+limite,
			busca as string,
		);
		const { data } = response;
		ok = response.ok;
		if (ok) {
			if (data) {
				const paginado = data as IPaginadoSubprefeituras;
				pagina = paginado.pagina || 1;
				limite = paginado.limite || 10;
				total = paginado.total || 0;
				dados = paginado.data || [];
			}
		}
	}

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Subprefeituras</h1>
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
							tag: 'tipo_subprefeitura',
							tipo: 2,
							default: 'all',
							valores: tipos_subprefeituras,
						},
					]}
				/>

				<DataTable columns={SubprefeituraColumns} data={dados || []} />
				{dados && dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
		</div>
	)
}
