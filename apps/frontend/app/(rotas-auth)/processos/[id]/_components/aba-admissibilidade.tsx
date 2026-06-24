/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formatarSei, validaDigitoSei } from '@/lib/utils';
import * as admissibilidade from '@/services/admissibilidade';
import * as processos from '@/services/processos';
import {
	dataEnvioAdmissibilidade,
	IAdmissibilidade,
	IInterfacesAdmissibilidade,
} from '@/types/admissibilidade';
import { IProcesso } from '@/types/processos';
import { ISubprefeitura } from '@/types/subprefeituras';
import { IUnidades } from '@/types/unidades';
import { Hand, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import ModalInadmitir from '@/app/(rotas-auth)/admissibilidade/_components/modal-inadmitir';
import ModalMotivos from '@/app/(rotas-auth)/admissibilidade/_components/modal-motivos';
import CardPrazoFase from './card-prazo-fase';

const STATUS_ADM: Record<
	number,
	{ label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
	0: { label: 'Admissível', variant: 'default' },
	1: { label: 'Em Análise', variant: 'secondary' },
	2: { label: 'Inadmissível', variant: 'destructive' },
	3: { label: 'Em Reconsideração', variant: 'outline' },
};

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
	const [modalInadmitirAberto, setModalInadmitirAberto] = useState(false);

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
	>({
		num_sehab: false,
		num_siurb: false,
		num_smc: false,
		num_smt: false,
		num_svma: false,
	});

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

	const config = STATUS_ADM[adm.status] ?? STATUS_ADM[1];
	const mostrarFormulario = adm.status !== 0;
	const podeInadmitir =
		adm.status !== 0 && adm.status !== 2 && adm.status !== 3;
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

	function normalizarNumeroInterface(valor?: string | null) {
		const limpo = valor?.replace(/\D/g, '') ?? '';
		return limpo.length > 0 ? limpo : null;
	}

	function campoInterfacePreenchido(campo: keyof IInterfacesAdmissibilidade) {
		return normalizarNumeroInterface(interfaces[campo] as string | null | undefined) !== null;
	}

	function seiInvalido(valor?: string | null) {
		if (!valor || valor.replace(/\D/g, '').length <= 18) return false;
		return !validaDigitoSei(valor);
	}

	function podeSalvar() {
		if (!subprefeituraId || !unidadeId || !dataDecisao) return false;
		if (+tipoProcesso === 2) {
			const algumMarcado = interfacesVisiveis.some(
				(item) => campoInterfacePreenchido(item.numKey),
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
			const payload: Parameters<typeof admissibilidade.atualizar>[1] = {
				status: 0,
				unidade_id: unidadeId,
				subprefeitura_id: subprefeituraId,
				data_decisao_interlocutoria: dataDecisao,
				tipo_processo: +tipoProcesso,
				inicial_id: processo.id,
			};

			if (+tipoProcesso === 2) {
				const numSehab = normalizarNumeroInterface(interfaces.num_sehab);
				const numSiurb = normalizarNumeroInterface(interfaces.num_siurb);
				const numSmc = normalizarNumeroInterface(interfaces.num_smc);
				const numSmt = normalizarNumeroInterface(interfaces.num_smt);
				const numSvma = normalizarNumeroInterface(interfaces.num_svma);

				payload.interfaces = {
					interface_sehab: !!numSehab,
					interface_siurb: !!numSiurb,
					interface_smc: !!numSmc,
					interface_smt: !!numSmt,
					interface_svma: !!numSvma,
					num_sehab: numSehab,
					num_siurb: numSiurb,
					num_smc: numSmc,
					num_smt: numSmt,
					num_svma: numSvma,
				};
			}

			const admResp = await admissibilidade.atualizar(processo.id, payload);
			if (!admResp.ok) {
				toast.error(admResp.error ?? 'Erro ao admitir processo');
				return;
			}

			const procResp = await processos.atualizar(processo.id, {
				tipo_processo: +tipoProcesso,
				status: 2,
				etapa_analise: 1,
				substatus_analise: +tipoProcesso === 2 ? 3 : 0,
			});

			if (procResp.ok) {
				toast.success('Processo admitido com sucesso');
				router.replace(`/processos/${processo.id}?tab=analise`);
				router.refresh();
				return;
			}

			toast.error(procResp.error ?? 'Erro ao atualizar status do processo');
		});
	}

	if (!mostrarFormulario) {
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
					<Campo
						label='Data envio'
						valor={formatarData(dataEnvio)}
					/>
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

	return (
		<div className='space-y-4'>
			<CardPrazoFase
				fase='admissibilidade'
				processo={processo}
				admissibilidade={adm}
			/>
		<Card>
			<CardHeader className='flex flex-row flex-wrap items-center justify-between gap-4'>
				<CardTitle>Admitir processo</CardTitle>
				<div className='flex flex-wrap items-center gap-2'>
					<Badge variant={config.variant}>{config.label}</Badge>
					<ModalMotivos compact />
					{podeInadmitir && (
						<Button
							type='button'
							size='sm'
							variant='outline'
							className='text-amber-600 hover:text-amber-700'
							onClick={() => setModalInadmitirAberto(true)}>
							<Hand className='mr-2 h-4 w-4' />
							Inadmitir
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='grid gap-2'>
					<Label>Processo (SEI)</Label>
					<Input value={formatarSei(processo.sei)} readOnly />
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<div className='grid gap-2'>
						<Label>Data envio</Label>
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
						<Label>Status</Label>
						<Input value='Admissível' readOnly />
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

				<div className='grid gap-4 sm:grid-cols-2'>
					<div className='grid gap-2'>
						<Label>Data decisão</Label>
						<Input
							type='date'
							value={dataDecisao}
							onChange={(e) => setDataDecisao(e.target.value)}
						/>
					</div>
				</div>

				{+tipoProcesso === 2 && (
					<div className='space-y-4 rounded-lg border p-4'>
						<p className='text-sm font-medium'>Interfaces</p>
						{interfacesVisiveis.map((item) => (
							<div
								key={item.label}
								className='grid gap-3 sm:grid-cols-[120px_1fr] items-center'>
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
					<Button onClick={salvar} disabled={isPending || !podeSalvar()}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Admitir processo
					</Button>
				</div>
			</CardContent>
		</Card>
			<ModalInadmitir
				open={modalInadmitirAberto}
				onOpenChange={setModalInadmitirAberto}
				inicialId={processo.id}
				sei={processo.sei ?? ''}
			/>
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
