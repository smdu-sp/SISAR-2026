/** @format */

import { auth } from '@/lib/auth/auth';
import * as processos from '@/services/processos';
import { IProcesso } from '@/types/processos';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProcessoTabs from './_components/processo-tabs';

export default function ProcessoDetalhePage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string; from?: string }>;
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
	searchParams: Promise<{ tab?: string; from?: string }>;
}) {
	const { id } = await params;
	const { tab, from } = await searchParams;
	const session = await auth();
	if (!session?.access_token) notFound();

	const response = await processos.buscarPorId(session.access_token, +id);
	if (!response.ok || !response.data) notFound();

	const processo = response.data as IProcesso;
	const voltarPara = from === 'analise' ? '/analise' : '/processos';

	return (
		<ProcessoTabs
			processo={processo}
			abaInicial={tab ?? null}
			voltarPara={voltarPara}
		/>
	);
}
