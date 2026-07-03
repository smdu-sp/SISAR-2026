/** @format */

import { auth } from '@/lib/auth/auth';
import { buscarTudo } from '@/services/processos/query-functions/buscar-tudo';
import { IProcesso } from '@/types/processos';
import { inferirFasePrazoAtual, prazoEtapaAtualListagem, FasePrazoProcesso } from '@/lib/prazo-fase';
import { rotuloProcessoListagem } from '@/lib/listagem-processo';
import { Suspense } from 'react';
import PainelClient, { ProcessoPainel, SituacaoPrazo } from './_components/painel-client';

function calcSituacao(processo: IProcesso): SituacaoPrazo {
	if (processo.status === 3 || processo.status === 4) return 'finalizado';
	const info = prazoEtapaAtualListagem(processo);
	const dias = info.diasRestantes;
	if (dias == null) return 'noprazo';
	if (dias < 0) return 'vencido';
	if (dias === 0) return 'hoje';
	if (dias <= 3) return 'avencer';
	return 'noprazo';
}

function calcFaseGrupo(fase: FasePrazoProcesso): string {
	if (fase === 'finalizacao') return 'Finalização';
	if (fase === 'analise') return 'Análise';
	return 'Admissibilidade';
}

export default async function PainelSuspense() {
	return (
		<Suspense fallback={<PainelSkeleton />}>
			<PainelPage />
		</Suspense>
	);
}

async function PainelPage() {
	const session = await auth();
	let processos: IProcesso[] = [];

	if (session?.access_token) {
		try {
			const resp = await buscarTudo(session.access_token, 1, 500, '', '-1');
			if (resp.ok && resp.data && 'data' in resp.data) {
				processos = resp.data.data;
			}
		} catch {
			// noop — show empty painel if fetch fails
		}
	}

	const processados: ProcessoPainel[] = processos.map((p) => {
		const fase = inferirFasePrazoAtual(p);
		const info = prazoEtapaAtualListagem(p);
		const situacao = calcSituacao(p);
		return {
			id: p.id,
			rotulo: rotuloProcessoListagem(p),
			requerimento: p.requerimento ?? null,
			status: p.status ?? null,
			alvaraNome: p.alvara_tipo?.nome ?? null,
			situacao,
			diasRestantes: info.diasRestantes ?? null,
			fase,
			faseGrupo: calcFaseGrupo(fase),
			tecnico: p.distribuicao?.tecnico_responsavel?.nome ?? null,
		};
	});

	const counts = {
		vencido: processados.filter((p) => p.situacao === 'vencido').length,
		hoje: processados.filter((p) => p.situacao === 'hoje').length,
		avencer: processados.filter((p) => p.situacao === 'avencer').length,
		noprazo: processados.filter((p) => p.situacao === 'noprazo').length,
		finalizado: processados.filter((p) => p.situacao === 'finalizado').length,
	};

	const ativosList = processados.filter((p) => p.situacao !== 'finalizado');
	const porFase = [
		{ nome: 'Admissibilidade', n: ativosList.filter((p) => p.faseGrupo === 'Admissibilidade').length },
		{ nome: 'Análise', n: ativosList.filter((p) => p.faseGrupo === 'Análise').length },
		{ nome: 'Finalização', n: ativosList.filter((p) => p.faseGrupo === 'Finalização').length },
	];
	const maxFase = Math.max(...porFase.map((x) => x.n), 1);
	const criticos = counts.vencido + counts.hoje;

	return (
		<PainelClient
			processos={processados}
			counts={counts}
			ativos={ativosList.length}
			criticos={criticos}
			porFase={porFase}
			maxFase={maxFase}
		/>
	);
}

function PainelSkeleton() {
	return (
		<div className='w-full max-w-screen-xl mx-auto px-0 md:px-2 py-2 space-y-5'>
			<div>
				<div className='h-7 w-48 rounded-lg bg-muted animate-pulse' />
				<div className='h-4 w-72 rounded-lg bg-muted animate-pulse mt-1.5' />
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='h-28 rounded-xl bg-card animate-pulse' />
				))}
			</div>
			<div className='grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4'>
				<div className='h-48 rounded-xl bg-card animate-pulse' />
				<div className='h-48 rounded-xl bg-card animate-pulse' />
			</div>
			<div className='h-64 rounded-xl bg-card animate-pulse' />
		</div>
	);
}
