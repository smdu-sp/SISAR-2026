/** @format */

'use client';

import { DeadlineRing, SitPill } from '@/app/(rotas-auth)/_components/deadline-ring';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calcSituacaoPrazo } from '@/lib/listagem-processo';
import { prazoEtapaAtualListagem, inferirFasePrazoAtual } from '@/lib/prazo-fase';
import { cn } from '@/lib/utils';
import { dataEnvioAdmissibilidade } from '@/types/admissibilidade';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import { ISubprefeitura } from '@/types/subprefeituras';
import { IUnidades } from '@/types/unidades';
import { IUsuario } from '@/types/usuario';
import { Bell, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import AbaAdmissibilidade from './aba-admissibilidade';
import AbaAnalise from './aba-analise';
import AbaDadosIniciais from './aba-dados-iniciais';
import AbaDistribuicao from './aba-distribuicao';
import AbaFinalizacao from './aba-finalizacao';
import AbaReconsideracaoAdm from './aba-reconsideracao-adm';
import LinhaDoTempo from './linha-do-tempo';

const STATUS_LABELS: Record<number, string> = {
	0: 'Admissibilidade',
	1: 'Via Ordinária',
	2: 'Em Análise',
	3: 'Deferido',
	4: 'Indeferido',
};

type AbaProcesso =
	| 'linha-do-tempo'
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
		case 'dados':
			return 'dados';
		default:
			return 'linha-do-tempo';
	}
}

function heroEtapaAtual(processo: IProcesso): string {
	const status = processo.status ?? 0;
	if (status === 2 || status === 4) {
		const ords = ['', '1ª', '2ª', '3ª', '4ª', '5ª'];
		const etapa = processo.etapa_analise ?? 1;
		return `${ords[etapa] ?? `${etapa}ª`} Análise`;
	}
	if (status === 3) return 'Finalização';
	if (status === 1) return 'Via Ordinária';
	const fase = inferirFasePrazoAtual(processo);
	switch (fase) {
		case 'admissibilidade': return 'Admissibilidade';
		case 'distribuicao': return 'Distribuição';
		default: return 'Dados iniciais';
	}
}

function heroDataLimite(processo: IProcesso): string | null {
	const status = processo.status ?? 0;
	if (status === 2) {
		const isMulti = processo.tipo_processo === 2;
		const raw = isMulti
			? processo.data_limiteMulti ?? processo.data_limiteSmul
			: processo.data_limiteSmul;
		if (!raw) return null;
		return new Date(raw).toLocaleDateString('pt-BR');
	}
	if (status === 0) {
		const envio = dataEnvioAdmissibilidade(processo.admissibilidade, processo);
		if (!envio) return null;
		const isMulti = processo.tipo_processo === 2;
		const prazo = isMulti
			? (processo.alvara_tipo?.prazo_admissibilidade_multi ?? 15)
			: (processo.alvara_tipo?.prazo_admissibilidade_smul ?? 15);
		const lim = new Date(envio);
		lim.setDate(lim.getDate() + prazo);
		return lim.toLocaleDateString('pt-BR');
	}
	return null;
}

function UserAvatar({ nome }: { nome: string }) {
	const parts = nome.trim().split(' ').filter(Boolean);
	const initials = [parts[0], parts[parts.length - 1]]
		.filter(Boolean)
		.map((p) => p[0].toUpperCase())
		.join('');
	const hue = (nome.charCodeAt(0) * 37 + nome.charCodeAt(1) * 13) % 360;
	return (
		<div
			className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0'
			style={{ background: `hsl(${hue} 55% 50%)` }}>
			{initials}
		</div>
	);
}

function SidebarSectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h3 className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3'>
			{children}
		</h3>
	);
}

function SidebarRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className='flex items-start justify-between gap-3 text-sm'>
			<span className='text-muted-foreground shrink-0'>{label}</span>
			<span className='font-medium text-right'>{value}</span>
		</div>
	);
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
			if (novaAba === 'linha-do-tempo') {
				params.delete('tab');
			} else {
				params.set('tab', novaAba);
			}
			const query = params.toString();
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const status = processo.status ?? 0;
	const mostrarAnalise = status === 2 || status === 3 || status === 4;
	const mostrarFinalizacao = status === 3;
	const forcarAnalise = searchParams.get('tab') === 'analise' || searchParams.get('tab') === '3';

	// Hero data
	const situacao = calcSituacaoPrazo(processo);
	const info = prazoEtapaAtualListagem(processo);
	const etapaAtual = heroEtapaAtual(processo);
	const dataLimite = heroDataLimite(processo);

	// Sidebar data
	const tecnico = processo.distribuicao?.tecnico_responsavel;
	const administrativo = processo.distribuicao?.administrativo_responsavel;
	const subpref = subprefeituras.find((s) => s.id === processo.admissibilidade?.subprefeitura_id);
	const unidade = unidades.find((u) => u.id === processo.admissibilidade?.unidade_id);
	const isMulti = processo.tipo_processo === 2;
	const alvara = processo.alvara_tipo;

	return (
		<div className='px-0 md:px-8 container mx-auto pb-10'>
			{/* Link voltar */}
			<div className='mb-4 pt-2'>
				<Link
					href={voltarPara}
					className='inline-flex items-center gap-1 text-sm text-primary hover:underline'>
					<ChevronLeft size={14} />
					Voltar para processos
				</Link>
			</div>

			{/* Hero card */}
			<Card className='mb-6'>
				<CardContent className='p-4 md:p-6'>
					<div className='flex items-start gap-5 flex-wrap md:flex-nowrap'>
						{/* Ring */}
						<div className='shrink-0'>
							<DeadlineRing
								situacao={situacao}
								dias={info.diasRestantes ?? null}
								size={96}
								stroke={8}
							/>
						</div>

						{/* Informações principais */}
						<div className='flex-1 min-w-0'>
							<div className='flex flex-wrap items-center gap-2 mb-1.5'>
								<span className='text-sm font-mono font-semibold text-muted-foreground'>
									{processo.sei}
								</span>
								<Badge>{STATUS_LABELS[status] ?? '—'}</Badge>
								{isMulti && (
									<Badge variant='outline'>Múltiplas Interfaces</Badge>
								)}
								{processo.reconsideracao_admissibilidade && (
									<Badge variant='secondary'>Reconsideração</Badge>
								)}
								{processo.decreto && (
									<Badge variant='secondary'>Decreto</Badge>
								)}
								{processo.requalifica_rapido && (
									<Badge variant='secondary'>Requalifica Rápido</Badge>
								)}
							</div>

							<p className='text-base font-semibold mb-3 leading-snug'>
								{processo.requerimento}
							</p>

							<div className='flex flex-wrap gap-5'>
								<div>
									<div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5'>
										Etapa atual
									</div>
									<div className='text-sm font-semibold'>{etapaAtual}</div>
								</div>
								{dataLimite && (
									<div>
										<div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5'>
											Data limite
										</div>
										<div
											className={cn(
												'text-sm font-semibold',
												situacao === 'vencido' && 'text-destructive',
												situacao === 'avencer' && 'text-orange-500',
											)}>
											{dataLimite}
										</div>
									</div>
								)}
								<div>
									<div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5'>
										Situação
									</div>
									<SitPill situacao={situacao} />
								</div>
							</div>
						</div>

						{/* Botões de ação */}
						<div className='flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0'>
							<Button size='sm' className='gap-1.5 flex-1 md:flex-none' disabled>
								<Bell size={14} /> Criar lembrete
							</Button>
							<Button variant='outline' size='sm' className='gap-1.5 flex-1 md:flex-none' asChild>
								<a
									href={`https://sei.prefeitura.sp.gov.br/`}
									target='_blank'
									rel='noopener noreferrer'>
									<ExternalLink size={14} /> Abrir no SEI
								</a>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Layout: conteúdo (tabs) + sidebar */}
			<div className='grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start'>
				{/* Conteúdo com abas */}
				<div>
					<Tabs value={abaAtiva} onValueChange={(v) => alterarAba(v as AbaProcesso)}>
						<TabsList className='flex-wrap h-auto w-full justify-start'>
							<TabsTrigger value='linha-do-tempo'>Linha do tempo</TabsTrigger>
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

						<TabsContent value='linha-do-tempo'>
							<LinhaDoTempo processo={processo} conclusao={conclusao} />
						</TabsContent>
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

				{/* Sidebar */}
				<div className='space-y-4'>
					{/* IDENTIFICAÇÃO */}
					<Card>
						<CardContent className='p-4 space-y-2.5'>
							<SidebarSectionTitle>Identificação</SidebarSectionTitle>
							<SidebarRow label='Processo' value={`#${processo.id}`} />
							{processo.aprova_digital && (
								<SidebarRow label='Aprova Digital' value={processo.aprova_digital} />
							)}
							{processo.processo_fisico && (
								<SidebarRow label='Proc. Físico' value={processo.processo_fisico} />
							)}
							<SidebarRow
								label='Protocolo'
								value={new Date(processo.data_protocolo).toLocaleDateString('pt-BR')}
							/>
						</CardContent>
					</Card>

					{/* RESPONSÁVEIS */}
					{(tecnico || administrativo) && (
						<Card>
							<CardContent className='p-4 space-y-4'>
								<SidebarSectionTitle>Responsáveis</SidebarSectionTitle>
								{tecnico && (
									<div>
										<div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2'>
											Técnico
										</div>
										<div className='flex items-center gap-2'>
											<UserAvatar nome={tecnico.nome} />
											<span className='text-sm'>{tecnico.nome}</span>
										</div>
									</div>
								)}
								{administrativo && (
									<div>
										<div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2'>
											Administrativo
										</div>
										<div className='flex items-center gap-2'>
											<UserAvatar nome={administrativo.nome} />
											<span className='text-sm'>{administrativo.nome}</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* LOTAÇÃO */}
					{(subpref || unidade) && (
						<Card>
							<CardContent className='p-4 space-y-2.5'>
								<SidebarSectionTitle>Lotação</SidebarSectionTitle>
								{subpref && (
									<SidebarRow label='Subprefeitura' value={subpref.nome} />
								)}
								{unidade && (
									<SidebarRow label='Unidade' value={unidade.sigla || unidade.nome} />
								)}
							</CardContent>
						</Card>
					)}

					{/* TIPO DE ALVARÁ · PRAZOS */}
					{alvara && (
						<Card>
							<CardContent className='p-4 space-y-2.5'>
								<SidebarSectionTitle>Tipo de Alvará · Prazos (d.u.)</SidebarSectionTitle>
								<p className='text-sm font-medium mb-2'>{alvara.nome}</p>
								<div className='space-y-1.5'>
									<SidebarRow
										label='Admissibilidade'
										value={`${isMulti ? alvara.prazo_admissibilidade_multi : alvara.prazo_admissibilidade_smul} d.u.`}
									/>
									<SidebarRow
										label='1ª Análise'
										value={`${isMulti ? alvara.prazo_analise_multi1 : alvara.prazo_analise_smul1} d.u.`}
									/>
									{((isMulti ? alvara.prazo_analise_multi2 : alvara.prazo_analise_smul2) > 0) && (
										<SidebarRow
											label='2ª Análise'
											value={`${isMulti ? alvara.prazo_analise_multi2 : alvara.prazo_analise_smul2} d.u.`}
										/>
									)}
									{((isMulti ? alvara.prazo_emissao_alvara_multi : alvara.prazo_emissao_alvara_smul) > 0) && (
										<SidebarRow
											label='Emissão alvará'
											value={`${isMulti ? alvara.prazo_emissao_alvara_multi : alvara.prazo_emissao_alvara_smul} d.u.`}
										/>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
