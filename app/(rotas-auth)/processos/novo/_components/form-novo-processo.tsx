/** @format */

'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { formatarSei } from '@/lib/utils';
import * as processos from '@/services/processos';
import { IAlvaras } from '@/types/alvaras';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const TIPO_REQUERIMENTO = [
	{ value: '1', label: 'IPTU' },
	{ value: '2', label: 'INCRA' },
	{ value: '3', label: 'Área Pública' },
];

export default function FormNovoProcesso({
	seiInicial,
	tiposAlvara,
}: {
	seiInicial: string;
	tiposAlvara: IAlvaras[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const hoje = new Date().toISOString().split('T')[0];

	const [sei, setSei] = useState(
		seiInicial ? formatarSei(seiInicial.replace(/\D/g, '')) : '',
	);
	const [tipoRequerimento, setTipoRequerimento] = useState('1');
	const [requerimento, setRequerimento] = useState('');
	const [alvaraTipoId, setAlvaraTipoId] = useState('');
	const [dataProtocolo, setDataProtocolo] = useState(hoje);
	const [envioAdmissibilidade, setEnvioAdmissibilidade] = useState(hoje);
	const [tipoProcesso, setTipoProcesso] = useState('1');
	const [processoFisico, setProcessoFisico] = useState('');
	const [aprovaDigital, setAprovaDigital] = useState('');
	const [obs, setObs] = useState('');

	function handleSeiChange(value: string) {
		setSei(formatarSei(value));
	}

	function salvar() {
		const seiLimpo = sei.replace(/\D/g, '');
		if (seiLimpo.length !== 16) {
			toast.error('SEI deve conter 16 dígitos');
			return;
		}
		if (!requerimento.trim()) {
			toast.error('Informe o requerimento');
			return;
		}
		if (!alvaraTipoId) {
			toast.error('Selecione o tipo de alvará');
			return;
		}

		startTransition(async () => {
			const res = await processos.criar({
				sei: seiLimpo,
				tipo_requerimento: +tipoRequerimento,
				requerimento: requerimento.trim(),
				alvara_tipo_id: alvaraTipoId,
				data_protocolo: dataProtocolo,
				envio_admissibilidade: envioAdmissibilidade,
				tipo_processo: +tipoProcesso,
				processo_fisico: processoFisico || undefined,
				aprova_digital: aprovaDigital || undefined,
				obs: obs || undefined,
			});

			if (res.ok && res.data && 'id' in res.data) {
				toast.success('Processo criado');
				router.push(`/processos/${res.data.id}`);
			} else {
				toast.error(res.error ?? 'Erro ao criar processo');
			}
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dados do processo</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-4 sm:grid-cols-2'>
				<div className='space-y-2 sm:col-span-2'>
					<Label>SEI</Label>
					<Input
						value={sei}
						onChange={(e) => handleSeiChange(e.target.value)}
						placeholder='0000.0000/0000000-0'
					/>
				</div>
				<div className='space-y-2'>
					<Label>Tipo de requerimento</Label>
					<Select
						value={tipoRequerimento}
						onValueChange={setTipoRequerimento}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TIPO_REQUERIMENTO.map((t) => (
								<SelectItem key={t.value} value={t.value}>
									{t.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label>Requerimento</Label>
					<Input
						value={requerimento}
						onChange={(e) => setRequerimento(e.target.value)}
						maxLength={3}
					/>
				</div>
				<div className='space-y-2 sm:col-span-2'>
					<Label>Tipo de alvará</Label>
					<Select value={alvaraTipoId} onValueChange={setAlvaraTipoId}>
						<SelectTrigger>
							<SelectValue placeholder='Selecione' />
						</SelectTrigger>
						<SelectContent>
							{tiposAlvara.map((a) => (
								<SelectItem key={a.id} value={a.id}>
									{a.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label>Data protocolo</Label>
					<Input
						type='date'
						value={dataProtocolo}
						onChange={(e) => setDataProtocolo(e.target.value)}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Data de Recebimento em SMUL/ATEC</Label>
					<Input
						type='date'
						value={envioAdmissibilidade}
						onChange={(e) => setEnvioAdmissibilidade(e.target.value)}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Tipo de processo</Label>
					<Select value={tipoProcesso} onValueChange={setTipoProcesso}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='1'>Próprio SMUL</SelectItem>
							<SelectItem value='2'>GRAPROEM (múltiplas interfaces)</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label>Processo físico</Label>
					<Input
						value={processoFisico}
						onChange={(e) => setProcessoFisico(e.target.value)}
					/>
				</div>
				<div className='space-y-2 sm:col-span-2'>
					<Label>Aprova digital</Label>
					<Input
						value={aprovaDigital}
						onChange={(e) => setAprovaDigital(e.target.value)}
					/>
				</div>
				<div className='space-y-2 sm:col-span-2'>
					<Label>Observações</Label>
					<Textarea
						value={obs}
						onChange={(e) => setObs(e.target.value)}
						rows={3}
					/>
				</div>
				<div className='sm:col-span-2 flex gap-2 justify-end'>
					<Button variant='outline' asChild>
						<Link href='/processos'>Cancelar</Link>
					</Button>
					<Button onClick={salvar} disabled={isPending}>
						Salvar processo
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
