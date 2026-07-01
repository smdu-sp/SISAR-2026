/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { BotaoCadastroFlutuante } from '@/components/cadastro/cadastro-lista';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as coordenadorias from '@/services/coordenadorias';
import * as diretorias from '@/services/diretorias';
import { ICoordenadoriaSelect } from '@/types/coordenadorias';
import { IDiretoria, IPaginadoDiretorias } from '@/types/diretorias';
import { Suspense } from 'react';
import { DiretoriasDataTable } from './_components/diretorias-data-table';
import ModalDiretoria from './_components/modal-diretoria';

export default function DiretoriasSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<DiretoriasPage searchParams={searchParams} />
		</Suspense>
	);
}

async function DiretoriasPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '', coordenadoria_id = 'all' } = await searchParams;
	let dados: IDiretoria[] = [];
	let opcoesCoord: ICoordenadoriaSelect[] = [];

	const session = await auth();
	if (session?.access_token) {
		const [respDir, respCoord] = await Promise.all([
			diretorias.buscarTudo(
				session.access_token,
				+pagina,
				+limite,
				busca as string,
				coordenadoria_id as string,
			),
			coordenadorias.listaCompleta(session.access_token),
		]);
		if (respCoord.ok && respCoord.data) {
			opcoesCoord = respCoord.data as ICoordenadoriaSelect[];
		}
		if (respDir.ok && respDir.data) {
			const paginado = respDir.data as IPaginadoDiretorias;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	}

	const filtroCoord = [
		{ label: 'Todas', value: 'all' },
		...opcoesCoord.map((c) => ({ label: c.label, value: c.value })),
	];

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Diretorias</h1>
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{ nome: 'Busca', tag: 'busca', tipo: 0, placeholder: 'Buscar diretoria...' },
						{
							nome: 'Coordenadoria',
							tag: 'coordenadoria_id',
							tipo: 2,
							default: 'all',
							valores: filtroCoord,
						},
					]}
				/>
				<DiretoriasDataTable
					dados={dados}
					coordenadorias={opcoesCoord}
				/>
				{dados.length > 0 && (
					<Pagination total={+total} pagina={+pagina} limite={+limite} />
				)}
			</div>
			<BotaoCadastroFlutuante>
				<ModalDiretoria coordenadorias={opcoesCoord} />
			</BotaoCadastroFlutuante>
		</div>
	);
}
