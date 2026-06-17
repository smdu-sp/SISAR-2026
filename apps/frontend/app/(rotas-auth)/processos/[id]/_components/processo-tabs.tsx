/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import { ISubprefeitura } from '@/types/subprefeituras';
import { IUnidades } from '@/types/unidades';
import { IUsuario } from '@/types/usuario';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import AbaAdmissibilidade from './aba-admissibilidade';
import AbaAnalise from './aba-analise';
import AbaReconsideracaoAdm from './aba-reconsideracao-adm';
import AbaDadosIniciais from './aba-dados-iniciais';
import AbaDistribuicao from './aba-distribuicao';
import AbaFinalizacao from './aba-finalizacao';

const STATUS: Record<number, string> = {
	0: 'Admissibilidade',
	1: 'Via Ordinária',
	2: 'Em Análise',
	3: 'Deferido',
	4: 'Indeferido',
};

type AbaProcesso =
	| 'dados'
	| 'distribuicao'
	| 'admissibilidade'
	| 'analise'
	| 'finalizacao';

function resolveAba(tab: string | null): AbaProcesso {
	switch (tab) {
		case 'distribuicao':
		case '1':
			return 'distribuicao';
		case 'admissibilidade':
		case '2':
			return 'admissibilidade';
		case 'analise':
		case '3':
			return 'analise';
		case 'finalizacao':
		case '4':
			return 'finalizacao';
		default:
			return 'dados';
	}
}

export default function ProcessoTabs({
	processo,
	abaInicial,
	voltarPara,
	administrativos,
	tecnicos,
	podeEditarDistribuicao,
	conclusao,
	unidades,
	subprefeituras,
}: {
	processo: IProcesso;
	abaInicial: string | null;
	voltarPara: string;
	administrativos: IUsuario[];
	tecnicos: IUsuario[];
	podeEditarDistribuicao: boolean;
	conclusao?: IConclusao | null;
	unidades: IUnidades[];
	subprefeituras: ISubprefeitura[];
}) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const abaAtiva = useMemo(
		() => resolveAba(searchParams.get('tab') ?? abaInicial),
		[searchParams, abaInicial],
	);

	const alterarAba = useCallback(
		(novaAba: AbaProcesso) => {
			const params = new URLSearchParams(searchParams.toString());
			if (novaAba === 'dados') {
				params.delete('tab');
			} else {
				params.set('tab', novaAba);
			}
			const query = params.toString();
			router.replace(query ? `${pathname}?${query}` : pathname, {
				scroll: false,
			});
		},
		[pathname, router, searchParams],
	);

	const status = processo.status ?? 0;
	const mostrarAnalise = status === 2 || status === 3 || status === 4;
	const mostrarFinalizacao = status === 3;
	const forcarAnalise =
		searchParams.get('tab') === 'analise' ||
		searchParams.get('tab') === '3';

	return (
		<div className='px-0 md:px-8 container mx-auto space-y-6'>
			<div className='flex items-center gap-3 flex-wrap'>
				<Link
					href={voltarPara}
					className='text-sm text-primary hover:underline'>
					← Voltar para processos
				</Link>
			</div>
			<div className='flex items-center gap-3 flex-wrap'>
				<h1 className='text-xl md:text-3xl font-bold'>
					Processo #{processo.id}
				</h1>
				<Badge>{STATUS[status] ?? '—'}</Badge>
			</div>

			<Tabs
				value={abaAtiva}
				onValueChange={(v) => alterarAba(v as AbaProcesso)}>
				<TabsList className='flex-wrap h-auto'>
					<TabsTrigger value='dados'>Dados iniciais</TabsTrigger>
					<TabsTrigger value='distribuicao'>Distribuição</TabsTrigger>
					<TabsTrigger value='admissibilidade'>Admissibilidade</TabsTrigger>
					{(mostrarAnalise || forcarAnalise) && (
						<TabsTrigger value='analise'>
							{status === 3 ? 'Análise (consulta)' : 'Análise técnica'}
						</TabsTrigger>
					)}
					{mostrarFinalizacao && (
						<TabsTrigger value='finalizacao'>Finalização</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value='dados' className='mt-4'>
					<AbaDadosIniciais processo={processo} />
				</TabsContent>
				<TabsContent value='distribuicao' className='mt-4'>
					<AbaDistribuicao
						processo={processo}
						distribuicao={processo.distribuicao}
						inicialId={processo.id}
						administrativos={administrativos}
						tecnicos={tecnicos}
						podeEditar={podeEditarDistribuicao}
					/>
				</TabsContent>
				<TabsContent value='admissibilidade' className='mt-4'>
					<div className='space-y-4'>
						{processo.admissibilidade?.status === 3 && (
							<AbaReconsideracaoAdm
								inicialId={processo.id}
								admissibilidade={processo.admissibilidade}
								reconsideracao={processo.reconsideracao_admissibilidade}
							/>
						)}
						<AbaAdmissibilidade
							processo={processo}
							admissibilidade={processo.admissibilidade}
							unidades={unidades}
							subprefeituras={subprefeituras}
						/>
					</div>
				</TabsContent>
				{(mostrarAnalise || forcarAnalise) && (
					<TabsContent value='analise' className='mt-4'>
						<AbaAnalise processo={processo} />
					</TabsContent>
				)}
				{mostrarFinalizacao && (
					<TabsContent value='finalizacao' className='mt-4'>
						<AbaFinalizacao
							processo={processo}
							conclusao={conclusao ?? processo.conclusao}
						/>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
