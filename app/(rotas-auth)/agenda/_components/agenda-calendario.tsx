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
	DialogTrigger,
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
import { BellPlus, CalendarDays, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type TipoAgenda = 'reunioes' | 'processos' | 'lembretes';

function formatarDataApi(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function diaDoMes(dataStr: string) {
	return parseInt(dataStr.split('T')[0].split('-')[2], 10);
}

export default function AgendaCalendario() {
	const { data: session } = useSession();
	const token = session?.access_token;

	const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
	const [tipo, setTipo] = useState<TipoAgenda>('reunioes');
	const [diasDestacados, setDiasDestacados] = useState<number[]>([]);
	const [itensDia, setItensDia] = useState<Record<string, unknown>[]>([]);
	const [carregando, setCarregando] = useState(false);
	const [processosLista, setProcessosLista] = useState<
		{ id: number; sei: string }[]
	>([]);

	const [modalLembrete, setModalLembrete] = useState(false);
	const [titulo, setTitulo] = useState('');
	const [descricao, setDescricao] = useState('');
	const [dataLembrete, setDataLembrete] = useState('');
	const [tipoLembrete, setTipoLembrete] = useState('0');
	const [inicialId, setInicialId] = useState('');

	const carregarMes = useCallback(
		async (date: Date, tipoAtual: TipoAgenda) => {
			if (!token) return;
			const mes = date.getMonth() + 1;
			const ano = date.getFullYear();
			let lista: { data_reuniao?: string; nova_data_reuniao?: string; data?: string; data_processo?: string }[] = [];

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
		let lista: Record<string, unknown>[] = [];

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

	async function salvarLembrete() {
		if (!token || !titulo || !inicialId) {
			toast.error('Preencha título e processo');
			return;
		}
		const ok = await avisos.criar(token, {
			titulo,
			descricao,
			data: new Date(dataLembrete || formatarDataApi(dataSelecionada)),
			inicial_id: parseInt(inicialId, 10),
			tipo: parseInt(tipoLembrete, 10),
		});
		if (ok) {
			toast.success('Lembrete criado');
			setModalLembrete(false);
			setTitulo('');
			setDescricao('');
			carregarMes(dataSelecionada, tipo);
			carregarDia();
		} else {
			toast.error('Erro ao criar lembrete');
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
								<TabsTrigger value='reunioes'>Reuniões</TabsTrigger>
								<TabsTrigger value='processos'>Processos</TabsTrigger>
								<TabsTrigger value='lembretes'>Lembretes</TabsTrigger>
							</TabsList>
						</Tabs>
						{tipo === 'lembretes' && (
							<Dialog
								open={modalLembrete}
								onOpenChange={setModalLembrete}>
								<DialogTrigger asChild>
									<Button
										size='sm'
										variant='outline'>
										<BellPlus className='size-4 mr-1' />
										Novo lembrete
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Adicionar lembrete</DialogTitle>
									</DialogHeader>
									<div className='space-y-4'>
										<div>
											<Label>Título</Label>
											<Input
												value={titulo}
												onChange={(e) => setTitulo(e.target.value)}
											/>
										</div>
										<div>
											<Label>Descrição</Label>
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
								? 'Sem notificações neste dia'
								: 'Sem compromissos neste dia'}
						</p>
					) : (
						<ul className='space-y-3'>
							{itensDia.map((item, idx) => {
								const inicial = (item as { inicial?: { sei?: string; id?: number } })
									.inicial;
								const sei = inicial?.sei ?? (item as { titulo?: string }).titulo;
								const idProc =
									(item as { inicial_id?: number }).inicial_id ?? inicial?.id;

								if (tipo === 'lembretes') {
									const aviso = item as {
										id: string;
										titulo: string;
										descricao: string;
									};
									return (
										<li
											key={aviso.id ?? idx}
											className='border rounded-lg p-4'>
											<p className='font-medium'>{aviso.titulo}</p>
											<p className='text-sm text-muted-foreground'>
												{aviso.descricao}
											</p>
										</li>
									);
								}

								return (
									<li
										key={idx}
										className='flex items-center justify-between border rounded-lg p-4 gap-2'>
										<div className='flex items-center gap-3'>
											<span
												className={`size-2.5 rounded-full shrink-0 ${coresTipo[tipo]}`}
											/>
											<div>
												<p className='font-medium'>
													{sei ? formatarSei(String(sei)) : '—'}
												</p>
											</div>
										</div>
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
									</li>
								);
							})}
						</ul>
					)}
					<div className='mt-4 flex gap-2'>
						<Badge variant='outline'>
							<span className='size-2 rounded-full bg-primary inline-block mr-1' />
							Reuniões
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
		</div>
	);
}
