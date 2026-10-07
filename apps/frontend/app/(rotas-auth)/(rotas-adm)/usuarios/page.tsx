/** @format */

import { BotaoCadastroFlutuante } from '@/components/cadastro/cadastro-lista';
import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as usuario from '@/services/usuarios';
import { IPaginadoUsuario, IUsuario } from '@/types/usuario';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalUpdateAndCreate from './_components/modal-update-create';
import { pageContainerComBotaoFlutuante } from '@/lib/utils';

export default async function UsuariosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Usuarios searchParams={searchParams} />
		</Suspense>
	);
}

async function Usuarios({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	let ok = false;
	const { busca = '', status = '', permissao = '' } = await searchParams;
	let dados: IUsuario[] = [];

	const session = await auth();
	if (session && session.access_token) {
		const response = await usuario.buscarTudo(
			session.access_token || '',
			+pagina,
			+limite,
			busca as string,
			status as string,
			permissao as string,
		);
		const { data } = response;
		ok = response.ok;
		if (ok) {
			if (data) {
				const paginado = data as IPaginadoUsuario;
				pagina = paginado.pagina || 1;
				limite = paginado.limite || 10;
				total = paginado.total || 0;
				dados = paginado.data || [];
			}
			const paginado = data as IPaginadoUsuario;
			dados = paginado.data || [];
		}
	}

	const statusSelect = [
		{
			label: 'Ativo',
			value: 'ATIVO',
		},
		{
			label: 'Inativo',
			value: 'INATIVO',
		},
	];

	const permissaoSelect = [
		{
			label: 'Desenvolvedor',
			value: 'DEV',
		},
		{
			label: 'Administrador',
			value: 'ADM',
		},
		{
			label: 'Supervisor',
			value: 'SUP',
		},
		{
			label: 'Usuário',
			value: 'USR',
		},
		{
			label: 'Gabinete / ASCOM',
			value: 'GAB_ASC',
		},
	];

	return (
		<div className={pageContainerComBotaoFlutuante}>
			<div className='grid grid-cols-1  gap-y-3 '>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Digite o nome, email ou login',
						},
						{
							nome: 'Status',
							tag: 'status',
							tipo: 2,
							valores: statusSelect,
							default: 'ATIVO',
						},
						{
							nome: 'Permissão',
							tag: 'permissao',
							tipo: 2,
							valores: permissaoSelect,
							default: 'all',
						},
					]}
				/>
				<div className='w-full'>
					<DataTable
						columns={columns}
						data={dados || []}
					/>
				</div>

				{dados && dados.length > 0 && (
					<Pagination
						total={+total}
						pagina={+pagina}
						limite={+limite}
					/>
				)}
			</div>
			<BotaoCadastroFlutuante>
				<ModalUpdateAndCreate isUpdating={false} />
			</BotaoCadastroFlutuante>
		</div>
	);
}
