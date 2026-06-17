/** @format */

import { auth } from '@/lib/auth/auth';
import { abaInicialProcesso } from '@/lib/processo-navegacao';
import * as finalizacao from '@/services/finalizacao';
import * as processos from '@/services/processos';
import * as subprefeituras from '@/services/subprefeituras';
import * as unidades from '@/services/unidades';
import * as usuarios from '@/services/usuarios';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import { ISubprefeitura } from '@/types/subprefeituras';
import { IUnidades } from '@/types/unidades';
import { IUsuario } from '@/types/usuario';
import { IFuncionarios } from '@/services/usuarios';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import ProcessoTabs from './_components/processo-tabs';

export default function ProcessoDetalhePage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}) {
	return (
		<Suspense fallback={<div className='p-8'>Carregando processo...</div>}>
			<ProcessoDetalhe params={params} searchParams={searchParams} />
		</Suspense>
	);
}

async function ProcessoDetalhe({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}) {
	const { id } = await params;
	const { tab } = await searchParams;
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const [response, funcResp, usuarioResp, unidadesResp, subprefResp] =
		await Promise.all([
		processos.buscarPorId(session.access_token, +id),
		usuarios.buscarFuncionarios(session.access_token),
		usuarios.validaUsuario(),
		unidades.listaCompleta(session.access_token),
		subprefeituras.listaCompleta(session.access_token),
	]);

	if (!response.ok || !response.data) notFound();

	const processo = response.data as IProcesso;
	let conclusao: IConclusao | null =
		processo.conclusao ?? null;

	if (!conclusao) {
		const finResp = await finalizacao.buscarPorInicial(
			session.access_token,
			+id,
		);
		if (finResp.ok && finResp.data) {
			conclusao = finResp.data;
		}
	}

	const funcionarios =
		funcResp.ok && funcResp.data
			? (funcResp.data as IFuncionarios)
			: null;
	const administrativos = funcionarios?.administrativos ?? [];
	const tecnicos = funcionarios?.tecnicos ?? [];

	const permissao =
		usuarioResp.ok && usuarioResp.data
			? (usuarioResp.data as IUsuario).permissao?.toString()
			: 'USR';
	const podeEditarDistribuicao = !['ADM', 'USR'].includes(permissao ?? 'USR');

	const listaUnidades = (unidadesResp.ok && Array.isArray(unidadesResp.data)
		? unidadesResp.data
		: []) as IUnidades[];
	const listaSubprefeituras = (subprefResp.ok && Array.isArray(subprefResp.data)
		? subprefResp.data
		: []) as ISubprefeitura[];

	return (
		<ProcessoTabs
			processo={processo}
			abaInicial={tab ?? abaInicialProcesso(processo.status) ?? null}
			voltarPara='/processos'
			administrativos={administrativos}
			tecnicos={tecnicos}
			podeEditarDistribuicao={podeEditarDistribuicao}
			conclusao={conclusao}
			unidades={listaUnidades}
			subprefeituras={listaSubprefeituras}
		/>
	);
}
