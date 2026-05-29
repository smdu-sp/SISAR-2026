/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProcesso } from '@/types/processos';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import AbaAnalise from './aba-analise';
import AbaDadosIniciais from './aba-dados-iniciais';

const STATUS: Record<number, string> = {
	0: 'Admissibilidade',
	1: 'Via Ordinária',
	2: 'Em Análise',
	3: 'Deferido',
	4: 'Indeferido',
};

type AbaProcesso = 'dados' | 'analise';

function resolveAba(tab: string | null): AbaProcesso {
	if (tab === 'analise' || tab === '3') return 'analise';
	return 'dados';
}

export default function ProcessoTabs({
	processo,
	abaInicial,
	voltarPara,
}: {
	processo: IProcesso;
	abaInicial: string | null;
	voltarPara: string;
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

	const mostrarAnalise =
		processo.status === 2 ||
		processo.status === 3 ||
		processo.status === 4 ||
		searchParams.get('tab') === 'analise' ||
		searchParams.get('tab') === '3';

	return (
		<div className='px-0 md:px-8 container mx-auto space-y-6'>
			<div className='flex items-center gap-3 flex-wrap'>
				<Link
					href={voltarPara}
					className='text-sm text-primary hover:underline'>
					{voltarPara === '/analise'
						? '← Voltar para em análise'
						: '← Voltar para processos'}
				</Link>
			</div>
			<div className='flex items-center gap-3 flex-wrap'>
				<h1 className='text-xl md:text-3xl font-bold'>
					Processo #{processo.id}
				</h1>
				<Badge>{STATUS[processo.status ?? 0] ?? '—'}</Badge>
			</div>

			<Tabs
				value={abaAtiva}
				onValueChange={(v) => alterarAba(v as AbaProcesso)}>
				<TabsList>
					<TabsTrigger value='dados'>Dados iniciais</TabsTrigger>
					{mostrarAnalise && (
						<TabsTrigger value='analise'>Análise</TabsTrigger>
					)}
				</TabsList>
				<TabsContent value='dados' className='mt-4'>
					<AbaDadosIniciais processo={processo} />
				</TabsContent>
				{mostrarAnalise && (
					<TabsContent value='analise' className='mt-4'>
						<AbaAnalise processo={processo} />
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
