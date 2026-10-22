/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatarSei } from '@/lib/utils';
import * as avisos from '@/services/avisos';
import * as processos from '@/services/processos';
import * as reunioes from '@/services/reunioes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
	BellPlus,
	CalendarClock,
	CalendarDays,
	ExternalLink,
	Loader2,
	Pencil,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type TipoAgenda = 'reunioes' | 'processos' | 'lembretes';

type ProcessoResumo = {
	id: number;
	sei: string;
};

type InicialAgenda = {
	id?: number;
	sei?: string;
};

type ItemAgenda = {
	id?: string;
	titulo?: string;
	descricao?: string;
	data?: string;
	data_reuniao?: string;
	data_processo?: string;
	nova_data_reuniao?: string | null;
	justificativa_remarcacao?: string | null;
	numero_reuniao?: string | null;
	instancia?: number;
	usuario_id?: string | null;
	inicial_id?: number;
	inicial?: InicialAgenda;
};

function formatarDataApi(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function diaDoMes(dataStr: string) {
	return parseInt(dataStr.split('T')[0].split('-')[2], 10);
}

function formatarDataCurta(data?: string | null) {
	if (!data) return null;
	const [ano, mes, dia] = String(data).split('T')[0].split('-');
	if (!ano || !mes || !dia) return String(data);
	return `${dia}/${mes}/${ano}`;
}

function dataParaInput(data?: string | null) {
	if (!data) return '';
	return String(data).split('T')[0];
}

function criarDataLocal(data: string) {
	const [ano, mes, dia] = data.split('-').map(Number);
	return new Date(ano, mes - 1, dia);
}

export default function AgendaCalendario() {
	const { data: session } = useSession();
	const token = session?.access_token;

	const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
	const [tipo, setTipo] = useState<TipoAgenda>('reunioes');
	const [diasDestacados, setDiasDestacados] = useState<number[]>([]);
	const [itensDia, setItensDia] = useState<ItemAgenda[]>([]);
	const [carregando, setCarregando] = useState(false);
	const [processosLista, setProcessosLista] = useState<ProcessoResumo[]>([]);

	const [modalLembrete, setModalLembrete] = useState(false);
	const [lembreteEditando, setLembreteEditando] = useState<ItemAgenda | null>(null);
	const [titulo, setTitulo] = useState('');
	const [descricao, setDescricao] = useState('');
	const [dataLembrete, setDataLembrete] = useState('');
	const [tipoLembrete, setTipoLembrete] = useState('0');
	const [inicialId, setInicialId] = useState('');

	const [modalRemarcacao, setModalRemarcacao] = useState(false);
	const [reuniaoEditando, setReuniaoEditando] = useState<ItemAgenda | null>(null);
	const [novaDataReuniao, setNovaDataReuniao] = useState('');
	const [justificativaRemarcacao, setJustificativaRemarcacao] = useState('');

	const carregarMes = useCallback(
		async (date: Date, tipoAtual: TipoAgenda) => {
			if (!token) return;
			const mes = date.getMonth() + 1;
			const ano = date.getFullYear();
			let lista: ItemAgenda[] = [];

			if (tipoAtual === 'reunioes') {
				lista = await reunioes.buscarPorMesAno(token, mes, ano);
			} else if (tipoAtual === 'processos') {
				lista = await processos.buscarPorMesAnoProcesso(token, mes, ano);
			} else {
				lista = await avisos.buscarPorMesAno(token, mes, ano);
			}

			const dias = new Set<number>();
			lista.forEach((item) => {
				const raw =
					item.nova_data_reuniao ||
					item.data_reuniao ||
					item.data_processo ||
					item.data;
				if (raw) dias.add(diaDoMes(String(raw)));
			});
			setDiasDestacados([...dias]);
		},
		[token],
	);

	const carregarDia = useCallback(async () => {
		if (!token) return;
		setCarregando(true);
		const dataStr = formatarDataApi(dataSelecionada);
		let lista: ItemAgenda[] = [];

		if (tipo === 'reunioes') {
			lista = await reunioes.buscarPorData(token, dataStr);
		} else if (tipo === 'processos') {
			lista = await processos.buscarPorDataProcesso(token, dataStr);
		} else {
			lista = await avisos.buscarPorData(token, dataStr);
		}

		setItensDia(lista);
		setCarregando(false);
	}, [token, dataSelecionada, tipo]);

	useEffect(() => {
		carregarMes(dataSelecionada, tipo);
	}, [dataSelecionada, tipo, carregarMes]);

	useEffect(() => {
		carregarDia();
	}, [carregarDia]);

	useEffect(() => {
		if (!token) return;
		processos.buscaProcessosParaAvisos(token).then((lista) => {
			setProcessosLista(lista ?? []);
		});
	}, [token]);

	function limparFormularioLembrete() {
		setLembreteEditando(null);
		setTitulo('');
		setDescricao('');
		setDataLembrete('');
		setTipoLembrete('0');
		setInicialId('');
	}

	function abrirNovoLembrete() {
		limparFormularioLembrete();
		setDataLembrete(formatarDataApi(dataSelecionada));
		setModalLembrete(true);
	}

	function abrirEdicaoLembrete(aviso: ItemAgenda) {
		setLembreteEditando(aviso);
		setTitulo(aviso.titulo ?? '');
		setDescricao(aviso.descricao ?? '');
		setDataLembrete(dataParaInput(aviso.data) || formatarDataApi(dataSelecionada));
		setTipoLembrete(aviso.usuario_id ? '1' : '0');
		setInicialId(String(aviso.inicial_id ?? aviso.inicial?.id ?? ''));
		setModalLembrete(true);
	}

	function fecharModalLembrete(open: boolean) {
		setModalLembrete(open);
		if (!open) limparFormularioLembrete();
	}

	async function salvarLembrete() {
		if (!token || !titulo || !inicialId) {
			toast.error('Preencha titulo e processo');
			return;
		}

		const payloadBase = {
			titulo,
			descricao,
			data: criarDataLocal(dataLembrete || formatarDataApi(dataSelecionada)),
			inicial_id: parseInt(inicialId, 10),
		};

		const resultado = lembreteEditando?.id
			? await avisos.atualizar(token, lembreteEditando.id, payloadBase)
			: await avisos.criar(token, {
					...payloadBase,
					tipo: parseInt(tipoLembrete, 10),
				});

		if (resultado) {
			toast.success(lembreteEditando ? 'Lembrete atualizado' : 'Lembrete criado');
			fecharModalLembrete(false);
			carregarMes(dataSelecionada, tipo);
			carregarDia();
		} else {
			toast.error('Erro ao salvar lembrete');
		}
	}

	async function excluirLembrete(id?: string) {
		if (!token || !id) return;
		const confirmou = window.confirm('Deseja excluir este lembrete?');
		if (!confirmou) return;

		const ok = await avisos.excluir(token, id);
		if (ok) {
			toast.success('Lembrete excluido');
			carregarMes(dataSelecionada, tipo);
			carregarDia();
		} else {
			toast.error('Erro ao excluir lembrete');
		}
	}

	function abrirRemarcacao(reuniao: ItemAgenda) {
		setReuniaoEditando(reuniao);
		setNovaDataReuniao(
			dataParaInput(reuniao.nova_data_reuniao || reuniao.data_reuniao),
		);
		setJustificativaRemarcacao(reuniao.justificativa_remarcacao ?? '');
		setModalRemarcacao(true);
	}

	function fecharModalRemarcacao(open: boolean) {
		setModalRemarcacao(open);
		if (!open) {
			setReuniaoEditando(null);
			setNovaDataReuniao('');
			setJustificativaRemarcacao('');
		}
	}

	async function salvarRemarcacao() {
		if (!token || !reuniaoEditando?.id || !novaDataReuniao) {
			toast.error('Informe a nova data');
			return;
		}
		if (!justificativaRemarcacao.trim()) {
			toast.error('Informe a justificativa');
			return;
		}

		const atualizada = await reunioes.atualizarData(
			token,
			reuniaoEditando.id,
			criarDataLocal(novaDataReuniao),
			justificativaRemarcacao,
		);

		if (atualizada) {
			toast.success('Reuniao remarcada');
			fecharModalRemarcacao(false);
			carregarMes(dataSelecionada, tipo);
			carregarDia();
		} else {
			toast.error('Erro ao remarcar reuniao');
		}
	}

	const modifiers = {
		destacado: (day: Date) => diasDestacados.includes(day.getDate()),
	};

	const modifiersClassNames = {
		destacado:
			'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1.5 after:rounded-full after:bg-primary',
	};

	const coresTipo: Record<TipoAgenda, string> = {
		reunioes: 'bg-primary',
		processos: 'bg-amber-500',
		lembretes: 'bg-green-600',
	};

	return (
		<div className='grid gap-6 lg:grid-cols-[auto_1fr]'>
			<Card className='w-fit mx-auto lg:mx-0'>
				<CardContent className='pt-6'>
					<Calendar
						mode='single'
						selected={dataSelecionada}
						onSelect={(d) => d && setDataSelecionada(d)}
						onMonthChange={(d) => d && carregarMes(d, tipo)}
						locale={ptBR}
						modifiers={modifiers}
						modifiersClassNames={modifiersClassNames}
					/>
					<p className='text-xs text-muted-foreground text-center mt-2'>
						{diasDestacados.length} dia(s) com eventos
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between gap-4 flex-wrap'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<CalendarDays className='size-5' />
							{format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", {
								locale: ptBR,
							})}
						</CardTitle>
					</div>
					<div className='flex items-center gap-2 flex-wrap'>
						<Tabs
							value={tipo}
							onValueChange={(v) => setTipo(v as TipoAgenda)}>
							<TabsList>
								<TabsTrigger value='reunioes'>Reunioes</TabsTrigger>
								<TabsTrigger value='processos'>Processos</TabsTrigger>
								<TabsTrigger value='lembretes'>Lembretes</TabsTrigger>
							</TabsList>
						</Tabs>
						{tipo === 'lembretes' && (
							<Button
								size='sm'
								variant='outline'
								onClick={abrirNovoLembrete}>
								<BellPlus className='size-4 mr-1' />
								Novo lembrete
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{carregando ? (
						<div className='flex justify-center py-12'>
							<Loader2 className='size-6 animate-spin' />
						</div>
					) : itensDia.length === 0 ? (
						<p className='text-muted-foreground text-center py-12'>
							{tipo === 'lembretes'
								? 'Sem notificacoes neste dia'
								: 'Sem compromissos neste dia'}
						</p>
					) : (
						<ul className='space-y-3'>
							{itensDia.map((item, idx) => {
								const inicial = item.inicial;
								const sei = inicial?.sei ?? item.titulo;
								const idProc = item.inicial_id ?? inicial?.id;
								const dataReuniao = formatarDataCurta(item.data_reuniao);
								const novaDataReuniao = formatarDataCurta(item.nova_data_reuniao);
								const dataProcesso = formatarDataCurta(item.data_processo);
								const dataLembreteFormatada = formatarDataCurta(item.data);

								if (tipo === 'lembretes') {
									return (
										<li
											key={item.id ?? idx}
											className='border rounded-lg p-4 space-y-3'>
											<div className='flex items-start justify-between gap-3'>
												<div>
													<p className='font-medium'>{item.titulo}</p>
													{item.descricao && (
														<p className='text-sm text-muted-foreground'>
															{item.descricao}
														</p>
													)}
												</div>
												<div className='flex gap-2 shrink-0'>
													<Button
														size='icon'
														variant='outline'
														onClick={() => abrirEdicaoLembrete(item)}>
														<Pencil className='size-4' />
													</Button>
													<Button
														size='icon'
														variant='outline'
														onClick={() => excluirLembrete(item.id)}>
														<Trash2 className='size-4' />
													</Button>
												</div>
											</div>
											<div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
												{dataLembreteFormatada && (
													<Badge variant='secondary'>
														{dataLembreteFormatada}
													</Badge>
												)}
												{idProc && (
													<Badge variant='outline'>
														Processo {formatarSei(String(inicial?.sei ?? idProc))}
													</Badge>
												)}
											</div>
										</li>
									);
								}

								return (
									<li
										key={item.id ?? idx}
										className='flex flex-col border rounded-lg p-4 gap-3 md:flex-row md:items-center md:justify-between'>
										<div className='flex items-start gap-3'>
											<span
												className={`mt-1 size-2.5 rounded-full shrink-0 ${coresTipo[tipo]}`}
											/>
											<div className='space-y-1'>
												<p className='font-medium'>
													{sei ? formatarSei(String(sei)) : '-'}
												</p>
												<div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
													{tipo === 'reunioes' && dataReuniao && (
														<Badge variant='secondary'>
															Reuniao: {dataReuniao}
														</Badge>
													)}
													{tipo === 'reunioes' && novaDataReuniao && (
														<Badge variant='outline'>
															Nova data: {novaDataReuniao}
														</Badge>
													)}
													{tipo === 'processos' && dataProcesso && (
														<Badge variant='secondary'>
															Processo: {dataProcesso}
														</Badge>
													)}
													{item.instancia && (
														<Badge variant='outline'>
															Instancia {item.instancia}
														</Badge>
													)}
													{item.numero_reuniao && (
														<Badge variant='outline'>
															Reuniao {item.numero_reuniao}
														</Badge>
													)}
												</div>
												{tipo === 'reunioes' && item.justificativa_remarcacao && (
													<p className='text-sm text-muted-foreground'>
														{item.justificativa_remarcacao}
													</p>
												)}
											</div>
										</div>
										<div className='flex flex-wrap gap-2 md:justify-end'>
											{tipo === 'reunioes' && (
												<Button
													size='sm'
													variant='outline'
													onClick={() => abrirRemarcacao(item)}>
													<CalendarClock className='size-4 mr-1' />
													Remarcar
												</Button>
											)}
											{idProc && (
												<Button
													asChild
													size='sm'
													variant='outline'>
													<Link href={`/processos/${idProc}`}>
														<ExternalLink className='size-4 mr-1' />
														Ver processo
													</Link>
												</Button>
											)}
										</div>
									</li>
								);
							})}
						</ul>
					)}
					<div className='mt-4 flex gap-2 flex-wrap'>
						<Badge variant='outline'>
							<span className='size-2 rounded-full bg-primary inline-block mr-1' />
							Reunioes
						</Badge>
						<Badge variant='outline'>
							<span className='size-2 rounded-full bg-amber-500 inline-block mr-1' />
							Processos
						</Badge>
						<Badge variant='outline'>
							<span className='size-2 rounded-full bg-green-600 inline-block mr-1' />
							Lembretes
						</Badge>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={modalLembrete}
				onOpenChange={fecharModalLembrete}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{lembreteEditando ? 'Editar lembrete' : 'Adicionar lembrete'}
						</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<Label>Titulo</Label>
							<Input
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
							/>
						</div>
						<div>
							<Label>Descricao</Label>
							<Textarea
								value={descricao}
								onChange={(e) => setDescricao(e.target.value)}
							/>
						</div>
						<div>
							<Label>Data</Label>
							<Input
								type='date'
								value={dataLembrete}
								onChange={(e) => setDataLembrete(e.target.value)}
							/>
						</div>
						<div>
							<Label>Tipo</Label>
							<Select
								value={tipoLembrete}
								onValueChange={setTipoLembrete}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='0'>Geral</SelectItem>
									<SelectItem value='1'>Pessoal</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Processo (SEI)</Label>
							<Select
								value={inicialId}
								onValueChange={setInicialId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione' />
								</SelectTrigger>
								<SelectContent>
									{processosLista.map((p) => (
										<SelectItem
											key={p.id}
											value={String(p.id)}>
											{p.sei}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button
							className='w-full'
							onClick={salvarLembrete}>
							Salvar
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={modalRemarcacao}
				onOpenChange={fecharModalRemarcacao}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remarcar reuniao</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<Label>Nova data</Label>
							<Input
								type='date'
								value={novaDataReuniao}
								onChange={(e) => setNovaDataReuniao(e.target.value)}
							/>
						</div>
						<div>
							<Label>Justificativa</Label>
							<Textarea
								value={justificativaRemarcacao}
								onChange={(e) => setJustificativaRemarcacao(e.target.value)}
							/>
						</div>
						<Button
							className='w-full'
							onClick={salvarRemarcacao}>
							Salvar remarcacao
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
