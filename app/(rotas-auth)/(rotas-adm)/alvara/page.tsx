/** @format */

import React from 'react';

import { Filtros } from '@/components/filtros';
import DataTable from '@/components/data-table';
import { auth } from '@/lib/auth/auth';
import { IPaginadoAlvaras, IAlvarasTipos } from '@/types/alvaras';
import Pagination from '@/components/pagination';
import { AlvarasColumns } from './_components/alvarasColumns';
import * as alvaras from '../../../../services/alvaras';
import { tipos_alvaras as tiposAlvarasOptions } from '@/lib/utils';



export default async function AlvaraPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	let ok = false;
	const { busca = '', tipos_alvaras: tiposAlvaras = 'all' } = await searchParams; // Renamed destructured variable to avoid conflict
	let dados: IAlvarasTipos[] = [];

	const session = await auth();
	if (session && session.access_token) {
		const response = await alvaras.buscarTudo(
			session.access_token || '',
			+pagina,
			+limite,
			busca as string,
		);
		const { data } = response;
		ok = response.ok;
		if (ok) {
			if (data) {
				const paginado = data as IPaginadoAlvaras;
				pagina = paginado.pagina || 1;
				limite = paginado.limite || 10;
				total = paginado.total || 0;
				dados = paginado.data || [];
			}
		}
	}

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Tipos de Alvará</h1>
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
							tag: 'tipos_alvaras',
							tipo: 2,
							default: 'all',
							valores: tiposAlvarasOptions,
						},
					]}
				/>

				<DataTable columns={AlvarasColumns} data={dados || []} />
				{dados && dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>

		</div>
	)

}
