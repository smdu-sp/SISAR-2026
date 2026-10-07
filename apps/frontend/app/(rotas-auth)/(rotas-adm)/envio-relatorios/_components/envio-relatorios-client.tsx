/** @format */

'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { tipos_relatorios } from '@/lib/utils';
import { atualizar, executarAgora, remover } from '@/services/envio-relatorios';
import { IEnvioAgendado } from '@/types/envio-relatorios';
import {
	History,
	Loader2,
	Mail,
	Pencil,
	Play,
	Plus,
	Trash2,
	TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import FormEnvio from './form-envio';
import HistoricoEnvio from './historico-envio';

const DIAS_SEMANA = [
	'domingo',
	'segunda-feira',
	'terça-feira',
	'quarta-feira',
	'quinta-feira',
	'sexta-feira',
	'sábado',
];

const ROTULO_PERIODO: Record<string, string> = {
	MES_ANTERIOR: 'Mês anterior',
	MES_ATUAL: 'Mês atual (até o envio)',
	ANO_ATUAL: 'Ano atual (até o envio)',
};

function dataHora(iso: string | null) {
	if (!iso) return '—';
	return new Date(iso).toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		dateStyle: 'short',
		timeStyle: 'short',
	});
}

function quando(e: IEnvioAgendado) {
	const hora = `${String(e.hora).padStart(2, '0')}:${String(e.minuto).padStart(2, '0')}`;
	if (e.frequencia === 'DIARIA') return `Todo dia às ${hora}`;
	if (e.frequencia === 'SEMANAL') return `Toda ${DIAS_SEMANA[e.dia_da_semana ?? 0]} às ${hora}`;
	return `Todo dia ${e.dia_do_mes} às ${hora}`;
}

export default function EnvioRelatoriosClient({
	envios,
	emailConfigurado,
}: {
	envios: IEnvioAgendado[];
	emailConfigurado: boolean;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [formAberto, setFormAberto] = useState(false);
	const [editando, setEditando] = useState<IEnvioAgendado | null>(null);
	const [historicoDe, setHistoricoDe] = useState<IEnvioAgendado | null>(null);
	const [excluindo, setExcluindo] = useState<IEnvioAgendado | null>(null);
	const [emExecucao, setEmExecucao] = useState<string | null>(null);

	function abrirNovo() {
		setEditando(null);
		setFormAberto(true);
	}

	function abrirEdicao(envio: IEnvioAgendado) {
		setEditando(envio);
		setFormAberto(true);
	}

	function alternarAtivo(envio: IEnvioAgendado, ativo: boolean) {
		startTransition(async () => {
			const resposta = await atualizar(envio.id, { ativo });
			if (!resposta.ok) {
				toast.error(resposta.error ?? 'Erro ao atualizar o envio.');
				return;
			}
			toast.success(ativo ? 'Envio ativado.' : 'Envio desativado.');
			router.refresh();
		});
	}

	function executar(envio: IEnvioAgendado) {
		setEmExecucao(envio.id);
		startTransition(async () => {
			const resposta = await executarAgora(envio.id);
			setEmExecucao(null);
			if (!resposta.ok || !resposta.data) {
				toast.error(resposta.error ?? 'Erro ao executar o envio.');
				return;
			}
			if (resposta.data.sucesso) {
				toast.success(`E-mail enviado para ${envio.destinatarios.length} destinatário(s).`);
			} else {
				toast.error(resposta.data.erro ?? 'O envio falhou.');
			}
			router.refresh();
		});
	}

	function excluir() {
		if (!excluindo) return;
		startTransition(async () => {
			const resposta = await remover(excluindo.id);
			if (!resposta.ok) {
				toast.error(resposta.error ?? 'Erro ao excluir o envio.');
				return;
			}
			toast.success('Envio excluído.');
			setExcluindo(null);
			router.refresh();
		});
	}

	return (
		<div className='space-y-4'>
			{!emailConfigurado && (
				<div className='flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm'>
					<TriangleAlert
						size={18}
						className='mt-0.5 shrink-0 text-amber-600'
					/>
					<div>
						<p className='font-medium'>O envio de e-mail ainda não está configurado.</p>
						<p className='text-muted-foreground'>
							Você já pode cadastrar os envios, mas eles só serão entregues depois que o servidor de
							e-mail for configurado. Enquanto isso, cada tentativa fica registrada como falha no
							histórico.
						</p>
					</div>
				</div>
			)}

			<div className='flex justify-end'>
				<Button onClick={abrirNovo}>
					<Plus />
					Novo envio
				</Button>
			</div>

			<Card>
				<CardContent className='p-0 overflow-x-auto'>
					{envios.length === 0 ? (
						<div className='flex flex-col items-center gap-2 py-16 text-muted-foreground'>
							<Mail
								size={36}
								strokeWidth={1.4}
							/>
							<p className='text-sm'>Nenhum envio agendado.</p>
						</div>
					) : (
						<Table roundednone='false'>
							<TableHeader>
								<TableRow>
									<TableHead>Envio</TableHead>
									<TableHead>Quando</TableHead>
									<TableHead>Período</TableHead>
									<TableHead>Destinatários</TableHead>
									<TableHead>Próximo envio</TableHead>
									<TableHead>Último envio</TableHead>
									<TableHead className='text-center'>Ativo</TableHead>
									<TableHead className='text-right'>Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{envios.map((envio) => (
									<TableRow key={envio.id}>
										<TableCell>
											<div className='font-medium text-sm'>{envio.nome}</div>
											<div className='text-xs text-muted-foreground'>
												{tipos_relatorios.find((t) => t.value === envio.tipo_relatorio)
													?.label ?? envio.tipo_relatorio}
											</div>
											<div className='mt-1 flex gap-1'>
												{envio.formato_pdf && <Badge variant='secondary'>PDF</Badge>}
												{envio.formato_excel && <Badge variant='secondary'>Excel</Badge>}
											</div>
										</TableCell>
										<TableCell className='text-sm whitespace-nowrap'>{quando(envio)}</TableCell>
										<TableCell className='text-sm'>{ROTULO_PERIODO[envio.periodo]}</TableCell>
										<TableCell
											className='text-sm'
											title={envio.destinatarios.join('\n')}>
											{envio.destinatarios.length === 1
												? envio.destinatarios[0]
												: `${envio.destinatarios.length} e-mails`}
										</TableCell>
										<TableCell className='text-sm whitespace-nowrap'>
											{envio.ativo ? dataHora(envio.proximo_envio_em) : '—'}
										</TableCell>
										<TableCell className='text-sm whitespace-nowrap'>
											{dataHora(envio.ultimo_envio_em)}
										</TableCell>
										<TableCell className='text-center'>
											<Switch
												checked={envio.ativo}
												disabled={isPending}
												onCheckedChange={(valor) => alternarAtivo(envio, valor)}
												aria-label={`Ativar ${envio.nome}`}
											/>
										</TableCell>
										<TableCell>
											<div className='flex justify-end gap-1'>
												<Button
													size='icon'
													variant='ghost'
													title='Enviar agora'
													disabled={isPending}
													onClick={() => executar(envio)}>
													{emExecucao === envio.id ? (
														<Loader2 className='animate-spin' />
													) : (
														<Play />
													)}
												</Button>
												<Button
													size='icon'
													variant='ghost'
													title='Histórico'
													onClick={() => setHistoricoDe(envio)}>
													<History />
												</Button>
												<Button
													size='icon'
													variant='ghost'
													title='Editar'
													onClick={() => abrirEdicao(envio)}>
													<Pencil />
												</Button>
												<Button
													size='icon'
													variant='ghost'
													title='Excluir'
													onClick={() => setExcluindo(envio)}>
													<Trash2 />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<FormEnvio
				key={editando?.id ?? 'novo'}
				aberto={formAberto}
				onAbertoChange={setFormAberto}
				envio={editando}
			/>
			<HistoricoEnvio
				envio={historicoDe}
				onFechar={() => setHistoricoDe(null)}
			/>

			<AlertDialog
				open={!!excluindo}
				onOpenChange={(aberto) => !aberto && setExcluindo(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Excluir envio agendado?</AlertDialogTitle>
						<AlertDialogDescription>
							O envio &quot;{excluindo?.nome}&quot; e o seu histórico serão removidos. Para apenas
							pausar, desative o envio.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={(e) => {
								e.preventDefault();
								excluir();
							}}>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
