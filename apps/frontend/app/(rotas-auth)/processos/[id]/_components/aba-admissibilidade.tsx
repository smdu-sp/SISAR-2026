/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { formatarSei, validaDigitoSei } from '@/lib/utils';
import { statusAdmissibilidade } from '@/lib/status-admissibilidade';
import * as admissibilidade from '@/services/admissibilidade';
import * as parecerAdmissibilidade from '@/services/parecer-admissibilidade';
import {
	dataEnvioAdmissibilidade,
	IAdmissibilidade,
	IInterfacesAdmissibilidade,
} from '@/types/admissibilidade';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { IProcesso } from '@/types/processos';
import { ISubprefeitura } from '@/types/subprefeituras';
import { IUnidades } from '@/types/unidades';
import { Hand, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import ModalMotivos from '@/app/(rotas-auth)/admissibilidade/_components/modal-motivos';
import CardPrazoFase from './card-prazo-fase';

interface InterfaceField {
	key: keyof IInterfacesAdmissibilidade;
	numKey: keyof IInterfacesAdmissibilidade;
	label: string;
}

const INTERFACES: InterfaceField[] = [
	{ key: 'interface_sehab', numKey: 'num_sehab', label: 'SEHAB' },
	{ key: 'interface_siurb', numKey: 'num_siurb', label: 'SIURB' },
	{ key: 'interface_smc', numKey: 'num_smc', label: 'SMC' },
	{ key: 'interface_smt', numKey: 'num_smt', label: 'SMT' },
	{ key: 'interface_svma', numKey: 'num_svma', label: 'SVMA' },
];

export default function AbaAdmissibilidade({
	processo,
	admissibilidade: adm,
	unidades,
	subprefeituras,
}: {
	processo: IProcesso;
	admissibilidade?: IAdmissibilidade | null;
	unidades: IUnidades[];
	subprefeituras: ISubprefeitura[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Inadmissão (inline)
	const [inadmitirAberto, setInadmitirAberto] = useState(false);
	const [pareceres, setPareceres] = useState<IParecerAdmissibilidade[]>([]);
	const [parecerId, setParecerId] = useState('');
	const [obsInadmissao, setObsInadmissao] = useState('');
	const [carregandoPareceres, setCarregandoPareceres] = useState(false);

	const hoje = new Date().toISOString().split('T')[0];
	const [tipoProcesso, setTipoProcesso] = useState(
		String(processo.tipo_processo ?? 1),
	);
	const [subprefeituraId, setSubprefeituraId] = useState(
		adm?.subprefeitura_id ?? '',
	);
	const [unidadeId, setUnidadeId] = useState(adm?.unidade_id ?? '');
	const [dataDecisao, setDataDecisao] = useState(
		adm?.data_decisao_interlocutoria
			? new Date(adm.data_decisao_interlocutoria).toISOString().split('T')[0]
			: hoje,
	);
	const [interfaces, setInterfaces] = useState<IInterfacesAdmissibilidade>({
		interface_sehab: processo.interfaces?.interface_sehab ?? false,
		interface_siurb: processo.interfaces?.interface_siurb ?? false,
		interface_smc: processo.interfaces?.interface_smc ?? false,
		interface_smt: processo.interfaces?.interface_smt ?? false,
		interface_svma: processo.interfaces?.interface_svma ?? false,
		num_sehab: processo.interfaces?.num_sehab ?? '',
		num_siurb: processo.interfaces?.num_siurb ?? '',
		num_smc: processo.interfaces?.num_smc ?? '',
		num_smt: processo.interfaces?.num_smt ?? '',
		num_svma: processo.interfaces?.num_svma ?? '',
	});
	const [interfacesAlteradas, setInterfacesAlteradas] = useState<
		Partial<Record<keyof IInterfacesAdmissibilidade, boolean>>
	>({});

	if (!adm) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase fase='admissibilidade' processo={processo} />
				<Card>
					<CardContent className='py-8 text-center text-muted-foreground'>
						<p>Admissibilidade ainda não registrada para este processo.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const config = statusAdmissibilidade(adm.status);
	const jaAdmitido = adm.status === 0;
	const podeInadmitir = adm.status === 1;
	const dataEnvio = dataEnvioAdmissibilidade(adm, processo);
	const mostrarSehab =
		new Date(processo.data_protocolo) <= new Date('2019-09-20');
	const interfacesVisiveis = INTERFACES.filter(
		(item) => item.label !== 'SEHAB' || mostrarSehab,
	);

	function atualizarInterface(campo: keyof IInterfacesAdmissibilidade, valor: string) {
		setInterfaces((prev) => ({ ...prev, [campo]: valor }));
		setInterfacesAlteradas((prev) => ({ ...prev, [campo]: true }));
	}

	function atualizarTemInterface(campo: keyof IInterfacesAdmissibilidade, valor: boolean) {
		setInterfaces((prev) => ({ ...prev, [campo]: valor }));
	}

	function normalizarNumeroInterface(valor?: string | null) {
		const limpo = valor?.replace(/\D/g, '') ?? '';
		return limpo.length > 0 ? limpo : null;
	}

	function seiInvalido(valor?: string | null) {
		if (!valor || valor.replace(/\D/g, '').length <= 18) return false;
		return !validaDigitoSei(valor);
	}

	function podeSalvar() {
		if (!subprefeituraId || !unidadeId || !dataDecisao) return false;
		if (+tipoProcesso === 2) {
			const algumMarcado = interfacesVisiveis.some(
				(item) => interfaces[item.key] === true,
			);
			if (!algumMarcado) return false;
			const algumSeiInvalido = interfacesVisiveis.some((item) => {
				const num = interfaces[item.numKey] as string;
				if (!normalizarNumeroInterface(num)) return false;
				return seiInvalido(num);
			});
			if (algumSeiInvalido) return false;
		}
		return true;
	}

	function salvar() {
		if (!podeSalvar()) {
			toast.error('Preencha todos os campos obrigatórios');
			return;
		}

		startTransition(async () => {
			const payload: admissibilidade.IAdmitirPayload = {
				unidade_id: unidadeId,
				subprefeitura_id: subprefeituraId,
				data_decisao_interlocutoria: dataDecisao,
				tipo_processo: +tipoProcesso,
			};

			if (+tipoProcesso === 2) {
				const numSehab = normalizarNumeroInterface(interfaces.num_sehab);
				const numSiurb = normalizarNumeroInterface(interfaces.num_siurb);
				const numSmc = normalizarNumeroInterface(interfaces.num_smc);
				const numSmt = normalizarNumeroInterface(interfaces.num_smt);
				const numSvma = normalizarNumeroInterface(interfaces.num_svma);

				payload.interfaces = {
					interface_sehab: interfaces.interface_sehab ?? false,
					interface_siurb: interfaces.interface_siurb ?? false,
					interface_smc: interfaces.interface_smc ?? false,
					interface_smt: interfaces.interface_smt ?? false,
					interface_svma: interfaces.interface_svma ?? false,
					num_sehab: numSehab,
					num_siurb: numSiurb,
					num_smc: numSmc,
					num_smt: numSmt,
					num_svma: numSvma,
				};
			}

			const resp = await admissibilidade.admitir(processo.id, payload);
			if (!resp.ok) {
				toast.error(resp.error ?? 'Erro ao admitir processo');
				return;
			}
			toast.success('Processo admitido com sucesso');
			router.replace(`/processos/${processo.id}?tab=analise`);
			router.refresh();
		});
	}

	async function abrirInadmitir() {
		setParecerId('');
		setObsInadmissao('');
		setInadmitirAberto(true);
		setCarregandoPareceres(true);
		const lista = await parecerAdmissibilidade.buscarAtivos();
		setPareceres(lista);
		setCarregandoPareceres(false);
	}

	function inadmitirProcesso() {
		if (!parecerId) {
			toast.error('Selecione um motivo');
			return;
		}
		startTransition(async () => {
			const resp = await admissibilidade.inadmitir(processo.id, {
				parecer_admissibilidade_id: parecerId,
				obs: obsInadmissao.trim() || undefined,
			});
			if (!resp.ok) {
				toast.error(resp.error ?? 'Erro ao inadmitir processo');
				return;
			}
			toast.success('Processo inadmitido — janela de reconsideração aberta');
			setInadmitirAberto(false);
			router.refresh();
		});
	}

	const dialogInadmitir = (
		<Dialog open={inadmitirAberto} onOpenChange={setInadmitirAberto}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Inadmitir processo</DialogTitle>
					<DialogDescription>
						Selecione o motivo da inadmissão. O processo entra em janela de
						reconsideração.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-2'>
					<div className='grid gap-2'>
						<div className='flex items-center justify-between gap-2'>
							<Label>Motivo</Label>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								className='h-auto px-2 text-xs'
								onClick={abrirInadmitir}
								disabled={carregandoPareceres}>
								<RefreshCw
									className={`mr-1 h-3 w-3 ${carregandoPareceres ? 'animate-spin' : ''}`}
								/>
								Atualizar
							</Button>
						</div>
						{carregandoPareceres ? (
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Carregando motivos...
							</div>
						) : pareceres.length === 0 ? (
							<p className='text-sm text-muted-foreground'>
								Nenhum motivo ativo cadastrado. Use <strong>Motivos</strong> no
								topo da aba para cadastrar.
							</p>
						) : (
							<Select value={parecerId} onValueChange={setParecerId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione o motivo' />
								</SelectTrigger>
								<SelectContent>
									{pareceres.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.parecer}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
					<div className='grid gap-2'>
						<Label>Observação (opcional)</Label>
						<Textarea
							value={obsInadmissao}
							onChange={(e) => setObsInadmissao(e.target.value)}
							rows={3}
							placeholder='Detalhes da inadmissão'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => setInadmitirAberto(false)}
						disabled={isPending}>
						Cancelar
					</Button>
					<Button
						type='button'
						variant='destructive'
						onClick={inadmitirProcesso}
						disabled={isPending || pareceres.length === 0}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Inadmitir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	// Processo já admitido → visão somente leitura.
	if (jaAdmitido) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase
					fase='admissibilidade'
					processo={processo}
					admissibilidade={adm}
				/>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between gap-4'>
						<CardTitle>Admissibilidade</CardTitle>
						<Badge variant={config.variant}>{config.label}</Badge>
					</CardHeader>
					<CardContent className='grid gap-4 sm:grid-cols-2'>
						<Campo label='Data de Recebimento em SMUL/ATEC' valor={formatarData(dataEnvio)} />
						<Campo
							label='Decisão interlocutória'
							valor={formatarData(adm.data_decisao_interlocutoria)}
						/>
						<Campo
							label='Reconsiderado'
							valor={adm.reconsiderado ? 'Sim' : 'Não'}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Processo inadmitido / em reconsideração (status 2 ou 3) → visão de estado.
	if (adm.status === 2 || adm.status === 3) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase
					fase='admissibilidade'
					processo={processo}
					admissibilidade={adm}
				/>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between gap-4'>
						<CardTitle>Admissibilidade</CardTitle>
						<Badge variant={config.variant}>{config.label}</Badge>
					</CardHeader>
					<CardContent className='grid gap-4 sm:grid-cols-2'>
						<Campo label='Data de Recebimento em SMUL/ATEC' valor={formatarData(dataEnvio)} />
						<Campo
							label='Decisão interlocutória'
							valor={formatarData(adm.data_decisao_interlocutoria)}
						/>
						{adm.obs && (
							<div className='sm:col-span-2'>
								<Campo label='Observação da inadmissão' valor={adm.obs} />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	// Estado inicial (status 1) → decidir: admitir ou inadmitir.
	return (
		<div className='space-y-4'>
			<CardPrazoFase
				fase='admissibilidade'
				processo={processo}
				admissibilidade={adm}
			/>
			<Card>
				<CardHeader className='flex flex-row flex-wrap items-center justify-between gap-4'>
					<div className='space-y-0.5'>
						<CardTitle>Decisão de admissibilidade</CardTitle>
						<p className='text-sm text-muted-foreground'>
							Admita o processo (segue para análise) ou inadmita (abre
							reconsideração).
						</p>
					</div>
					<div className='flex flex-wrap items-center gap-2'>
						<Badge variant={config.variant}>{config.label}</Badge>
						<ModalMotivos compact />
					</div>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='grid gap-2'>
							<Label>Processo (SEI)</Label>
							<Input value={formatarSei(processo.sei)} readOnly />
						</div>
						<div className='grid gap-2'>
							<Label>Data de Recebimento em SMUL/ATEC</Label>
							<Input value={formatarData(dataEnvio)} readOnly />
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='grid gap-2'>
							<Label>Tipo de processo</Label>
							<Select value={tipoProcesso} onValueChange={setTipoProcesso}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>Próprio de SMUL</SelectItem>
									<SelectItem value='2'>GRAPROEM (múltiplas interfaces)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label>Data decisão</Label>
							<Input
								type='date'
								value={dataDecisao}
								onChange={(e) => setDataDecisao(e.target.value)}
							/>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='grid gap-2'>
							<Label>Subprefeitura</Label>
							<Select
								value={subprefeituraId}
								onValueChange={setSubprefeituraId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione a subprefeitura' />
								</SelectTrigger>
								<SelectContent>
									{subprefeituras.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label>Unidade</Label>
							<Select value={unidadeId} onValueChange={setUnidadeId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione a unidade' />
								</SelectTrigger>
								<SelectContent>
									{unidades.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.sigla} — {item.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{+tipoProcesso === 2 && (
						<div className='space-y-4 rounded-lg border p-4'>
							<div className='grid gap-3 sm:grid-cols-[120px_1fr_220px] items-center'>
								<p className='text-sm font-medium'>Interfaces</p>
								<div className='hidden sm:block' />
								<p className='text-sm font-bold'>Tem Interface?</p>
							</div>
							{interfacesVisiveis.map((item) => (
								<div
									key={item.label}
									className='grid gap-3 sm:grid-cols-[120px_1fr_220px] items-center'>
									<Label htmlFor={item.label}>{item.label}</Label>
									<div className='grid gap-1'>
										<Input
											id={item.label}
											placeholder={`Processo ${item.label}`}
											value={(interfaces[item.numKey] as string) ?? ''}
											onChange={(e) =>
												atualizarInterface(
													item.numKey,
													formatarSei(e.target.value),
												)
											}
										/>
										{interfacesAlteradas[item.numKey] &&
											seiInvalido(interfaces[item.numKey] as string) && (
												<p className='text-sm text-destructive'>SEI inválido</p>
											)}
									</div>
									<div className='flex items-center gap-5'>
										<label className='flex items-center gap-2 text-sm font-medium'>
											<Checkbox
												checked={interfaces[item.key] === true}
												onCheckedChange={(checked) =>
													atualizarTemInterface(item.key, checked === true)
												}
											/>
											<span>SIM</span>
										</label>
										<label className='flex items-center gap-2 text-sm font-medium'>
											<Checkbox
												checked={interfaces[item.key] === false}
												onCheckedChange={(checked) => {
													if (checked === true) {
														atualizarTemInterface(item.key, false);
													}
												}}
											/>
											<span>NÃO</span>
										</label>
									</div>
								</div>
							))}
						</div>
					)}

					<div className='flex justify-end gap-2'>
						<Button
							variant='outline'
							type='button'
							disabled={isPending}
							onClick={() =>
								router.replace(`/processos/${processo.id}?tab=dados`)
							}>
							Cancelar
						</Button>
						{podeInadmitir && (
							<Button
								type='button'
								variant='destructive'
								disabled={isPending}
								onClick={abrirInadmitir}>
								<Hand className='mr-2 h-4 w-4' />
								Inadmitir
							</Button>
						)}
						<Button onClick={salvar} disabled={isPending || !podeSalvar()}>
							{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Admitir processo
						</Button>
					</div>
				</CardContent>
			</Card>
			{dialogInadmitir}
		</div>
	);
}

function Campo({ label, valor }: { label: string; valor: string }) {
	return (
		<div>
			<p className='text-sm text-muted-foreground'>{label}</p>
			<p className='font-medium'>{valor}</p>
		</div>
	);
}

function formatarData(valor?: string | Date | null) {
	if (!valor) return '—';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '—';
	return data.toLocaleDateString('pt-BR');
}
