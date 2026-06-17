/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatarSei } from '@/lib/utils';
import * as analise from '@/services/analise';
import {
	IContextoAnalise,
	ParecerDecisao,
	SubstatusAnalise,
} from '@/types/analise';
import { IProcesso } from '@/types/processos';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import CardPrazoFase from './card-prazo-fase';
import HistoricoAnaliseTecnica from './historico-analise-tecnica';

const SUBSTATUS_LABEL: Record<number, string> = {
	[SubstatusAnalise.NORMAL]: 'Em análise',
	[SubstatusAnalise.COMUNIQUE_SE]: 'Aguardando resposta do comunique-se',
	[SubstatusAnalise.AGUARDANDO_RECURSO]: 'Aguardando recurso do munícipe',
	[SubstatusAnalise.PRE_REUNIAO_GRAPROEM]: 'Pré-reunião GRAPROEM pendente',
};

function hoje() {
	return new Date().toISOString().split('T')[0];
}

function dataParaInput(valor?: string | Date | null) {
	if (!valor) return '';
	const d = new Date(valor);
	if (Number.isNaN(d.getTime())) return '';
	return d.toISOString().split('T')[0];
}

function formatarDataBr(valor?: string | Date | null) {
	if (!valor) return '—';
	const d = new Date(valor);
	if (Number.isNaN(d.getTime())) return '—';
	return d.toLocaleDateString('pt-BR');
}

export default function AbaAnalise({ processo }: { processo: IProcesso }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [carregando, setCarregando] = useState(true);
	const [ctx, setCtx] = useState<IContextoAnalise | null>(null);

	const [dataReuniao, setDataReuniao] = useState(hoje());
	const [dataProcesso, setDataProcesso] = useState(hoje());
	const [numeroReuniao, setNumeroReuniao] = useState('');
	const [parecerGrupo, setParecerGrupo] = useState('');
	const [novaDataReuniao, setNovaDataReuniao] = useState('');
	const [justificativaRemarcacao, setJustificativaRemarcacao] = useState('');
	const [dataComunique, setDataComunique] = useState(hoje());
	const [dataRespostaCs, setDataRespostaCs] = useState(hoje());
	const [obsDecisao, setObsDecisao] = useState('');

	const recarregar = useCallback(async () => {
		setCarregando(true);
		const res = await analise.obterContexto(processo.id);
		if (res.ok && res.data) {
			const c = res.data as IContextoAnalise;
			setCtx(c);
			if (c.reuniao_atual) {
				setDataReuniao(dataParaInput(c.reuniao_atual.data_reuniao) || hoje());
				setDataProcesso(
					dataParaInput(c.reuniao_atual.data_processo) || hoje(),
				);
				setNumeroReuniao(c.reuniao_atual.numero_reuniao ?? '');
				setParecerGrupo(c.reuniao_atual.parecer_grupo ?? '');
				setNovaDataReuniao(dataParaInput(c.reuniao_atual.nova_data_reuniao));
				setJustificativaRemarcacao(
					c.reuniao_atual.justificativa_remarcacao ?? '',
				);
			} else {
				setNovaDataReuniao('');
				setJustificativaRemarcacao('');
			}
		} else {
			toast.error(res.error ?? 'Erro ao carregar análise');
		}
		setCarregando(false);
	}, [processo.id]);

	useEffect(() => {
		recarregar();
	}, [recarregar]);

	if (processo.status !== 2 && processo.status !== 3 && processo.status !== 4) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase fase='analise' processo={processo} />
				<Card>
					<CardContent className='py-8 text-center text-muted-foreground text-sm'>
						Análise técnica disponível quando o processo está em análise ou
						após indeferimento definitivo.
					</CardContent>
				</Card>
			</div>
		);
	}

	if (carregando || !ctx) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase fase='analise' processo={processo} />
				<div className='flex justify-center py-12'>
					<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
				</div>
			</div>
		);
	}

	const graproem = ctx.graproem;
	const instancia = ctx.etapa_analise;
	const somenteConsulta =
		processo.status === 3 ||
		(processo.status === 4 && ctx.indeferimento_definitivo);

	if (somenteConsulta) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase fase='analise' processo={processo} />
			<HistoricoAnaliseTecnica
				processo={processo}
				ctx={ctx}
				mostrarLinkFinalizacao={processo.status === 3}
			/>
			</div>
		);
	}

	function salvarPreReuniao() {
		if (!dataReuniao || !dataProcesso) {
			toast.error('Informe as datas da reunião e do processo');
			return;
		}
		if (!numeroReuniao.trim() || !parecerGrupo.trim()) {
			toast.error('Informe número da reunião e parecer do grupo');
			return;
		}
		if (novaDataReuniao.trim() && !justificativaRemarcacao.trim()) {
			toast.error('Informe a justificativa da remarcação');
			return;
		}
		startTransition(async () => {
			const res = await analise.registrarPreReuniao(processo.id, {
				data_reuniao: dataReuniao,
				data_processo: dataProcesso,
				numero_reuniao: numeroReuniao.trim(),
				parecer_grupo: parecerGrupo.trim(),
				nova_data_reuniao: novaDataReuniao.trim() || undefined,
				justificativa_remarcacao:
					justificativaRemarcacao.trim() || undefined,
			});
			if (res.ok) {
				toast.success('Pré-reunião registrada');
				await recarregar();
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao salvar pré-reunião');
			}
		});
	}

	function enviarComuniqueSe() {
		startTransition(async () => {
			const res = await analise.registrarComuniqueSe(processo.id, {
				data: dataComunique,
			});
			if (res.ok) {
				toast.success('Comunique-se registrado');
				await recarregar();
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao registrar comunique-se');
			}
		});
	}

	function registrarResposta() {
		if (!ctx.comunique_aberto) return;
		startTransition(async () => {
			const res = await analise.registrarRespostaComuniqueSe(
				ctx.comunique_aberto!.id,
				processo.id,
				dataRespostaCs,
			);
			if (res.ok) {
				toast.success('Resposta registrada');
				await recarregar();
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao registrar resposta');
			}
		});
	}

	function decidir(parecer: number) {
		startTransition(async () => {
			const res = await analise.registrarDecisao(
				processo.id,
				parecer,
				obsDecisao || undefined,
			);
			if (!res.ok) {
				toast.error(res.error ?? 'Erro ao registrar decisão');
				return;
			}
			const payload = res.data as {
				proxima_acao?: string;
				mensagem?: string;
				resultado?: string;
			};
			toast.success(payload.mensagem ?? 'Decisão registrada');
			await recarregar();
			router.refresh();
			if (
				payload.proxima_acao === 'FINALIZACAO' &&
				payload.resultado === 'DEFERIDO'
			) {
				router.replace(`/processos/${processo.id}?tab=finalizacao`);
			}
		});
	}

	function recurso() {
		startTransition(async () => {
			const res = await analise.registrarRecurso(processo.id);
			if (res.ok) {
				const payload = res.data as { mensagem?: string };
				toast.success(payload.mensagem ?? 'Recurso registrado');
				await recarregar();
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao registrar recurso');
			}
		});
	}

	function encerrarRecurso() {
		startTransition(async () => {
			const res = await analise.encerrarSemRecurso(processo.id);
			if (res.ok) {
				const payload = res.data as { mensagem?: string };
				toast.success(
					payload.mensagem ?? 'Prazo de recurso encerrado',
				);
				await recarregar();
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao encerrar recurso');
			}
		});
	}

	return (
		<div className='space-y-4'>
			<CardPrazoFase fase='analise' processo={processo} />
			<Card>
				<CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2'>
					<CardTitle>Análise técnica</CardTitle>
					<div className='flex flex-wrap gap-2'>
						<Badge>
							{graproem ? 'GRAPROEM' : 'SMUL'} — {instancia}ª instância
						</Badge>
						<Badge variant='outline'>
							{SUBSTATUS_LABEL[ctx.substatus_analise] ?? '—'}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className='grid gap-2 sm:grid-cols-2 text-sm'>
					<p>
						<span className='text-muted-foreground'>SEI: </span>
						{formatarSei(processo.sei)}
					</p>
					<p>
						<span className='text-muted-foreground'>Técnico: </span>
						{ctx.distribuicao?.tecnico_responsavel?.nome ?? '—'}
					</p>
				</CardContent>
			</Card>

			{graproem && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>
							Reunião GRAPROEM ({instancia}ª instância)
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>
							Cadastre os dados da reunião conforme a tabela do processo:
							datas, número, parecer do grupo e remarcação, se houver.
						</p>
						{!ctx.pode_registrar_pre_reuniao && (
							<p className='text-sm text-amber-700 dark:text-amber-400'>
								Edição indisponível enquanto o processo aguarda resposta de
								comunique-se.
							</p>
						)}
						<div className='grid gap-4 sm:grid-cols-2'>
							<div className='space-y-2'>
								<Label>Data da reunião</Label>
								<Input
									type='date'
									value={dataReuniao}
									onChange={(e) => setDataReuniao(e.target.value)}
									disabled={!ctx.pode_registrar_pre_reuniao || isPending}
								/>
							</div>
							<div className='space-y-2'>
								<Label>Data do processo</Label>
								<Input
									type='date'
									value={dataProcesso}
									onChange={(e) => setDataProcesso(e.target.value)}
									disabled={!ctx.pode_registrar_pre_reuniao || isPending}
								/>
							</div>
							<div className='space-y-2'>
								<Label>Número da reunião</Label>
								<Input
									value={numeroReuniao}
									onChange={(e) => setNumeroReuniao(e.target.value)}
									disabled={!ctx.pode_registrar_pre_reuniao || isPending}
								/>
							</div>
							<div className='space-y-2'>
								<Label>Nova data da reunião (remarcação)</Label>
								<Input
									type='date'
									value={novaDataReuniao}
									onChange={(e) => setNovaDataReuniao(e.target.value)}
									disabled={!ctx.pode_registrar_pre_reuniao || isPending}
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<Label>Parecer do grupo</Label>
							<Textarea
								value={parecerGrupo}
								onChange={(e) => setParecerGrupo(e.target.value)}
								rows={4}
								disabled={!ctx.pode_registrar_pre_reuniao || isPending}
							/>
						</div>
						<div className='space-y-2'>
							<Label>Justificativa da remarcação</Label>
							<Textarea
								value={justificativaRemarcacao}
								onChange={(e) => setJustificativaRemarcacao(e.target.value)}
								rows={2}
								disabled={!ctx.pode_registrar_pre_reuniao || isPending}
								placeholder='Obrigatória se informar nova data da reunião'
							/>
						</div>
						<Button
							onClick={salvarPreReuniao}
							disabled={
								!ctx.pode_registrar_pre_reuniao || isPending
							}>
							Salvar dados da reunião
						</Button>

						{ctx.reunioes.length > 1 && (
							<div className='border-t pt-4 space-y-2'>
								<p className='text-sm font-medium'>
									Outras instâncias (consulta)
								</p>
								<ul className='text-sm space-y-2'>
									{ctx.reunioes
										.filter((r) => r.instancia !== instancia)
										.map((r) => (
											<li key={r.id} className='rounded-md border p-2'>
												<p>
													<span className='text-muted-foreground'>
														Instância:{' '}
													</span>
													{r.instancia}
												</p>
												<p>
													Reunião: {formatarDataBr(r.data_reuniao)}
													{r.nova_data_reuniao
														? ` → remarcada para ${formatarDataBr(r.nova_data_reuniao)}`
														: ''}
												</p>
												<p>
													Processo: {formatarDataBr(r.data_processo)}
												</p>
												<p>
													Nº reunião: {r.numero_reuniao?.trim() || '—'}
												</p>
											</li>
										))}
								</ul>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{ctx.pode_registrar_resposta_comunique && ctx.comunique_aberto && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Resposta ao comunique-se</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2 max-w-xs'>
							<Label>Data da resposta</Label>
							<Input
								type='date'
								value={dataRespostaCs}
								onChange={(e) => setDataRespostaCs(e.target.value)}
							/>
						</div>
						<Button onClick={registrarResposta} disabled={isPending}>
							Registrar resposta
						</Button>
						{graproem && (
							<p className='text-sm text-muted-foreground'>
								Após a resposta, o processo retorna à etapa de pré-reunião
								GRAPROEM.
							</p>
						)}
					</CardContent>
				</Card>
			)}

			{ctx.substatus_analise === SubstatusAnalise.AGUARDANDO_RECURSO && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Recurso do munícipe</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-wrap gap-2'>
						{ctx.pode_registrar_recurso && (
							<Button onClick={recurso} disabled={isPending}>
								Registrar recurso — {instancia + 1}ª instância
							</Button>
						)}
						<Button
							variant='outline'
							onClick={encerrarRecurso}
							disabled={isPending}>
							Encerrar sem recurso (via ordinária)
						</Button>
					</CardContent>
				</Card>
			)}

			{ctx.pode_decidir && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Decisão técnica</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label>Observações (opcional)</Label>
							<Textarea
								value={obsDecisao}
								onChange={(e) => setObsDecisao(e.target.value)}
								rows={2}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<Button
								onClick={() => decidir(ParecerDecisao.DEFERIDO)}
								disabled={isPending}>
								Deferir
							</Button>
							<Button
								variant='destructive'
								onClick={() => decidir(ParecerDecisao.INDEFERIDO)}
								disabled={isPending}>
								Indeferir
							</Button>
							{ctx.pode_comunique_se && (
								<>
									<Button
										variant='secondary'
										onClick={enviarComuniqueSe}
										disabled={isPending}>
										Comunique-se (publicação)
									</Button>
									<Input
										type='date'
										className='max-w-[160px]'
										value={dataComunique}
										onChange={(e) => setDataComunique(e.target.value)}
										title='Data do comunique-se'
									/>
								</>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{ctx.comunique_ses.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Histórico de comunique-se</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='text-sm space-y-2'>
							{ctx.comunique_ses.map((c) => (
								<li key={c.id} className='border rounded-md p-2'>
									Instância {c.etapa} — publicado em{' '}
									{new Date(c.data).toLocaleDateString('pt-BR')}
									{c.data_resposta
										? ` — resposta em ${new Date(c.data_resposta).toLocaleDateString('pt-BR')}`
										: ' — aguardando resposta'}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
