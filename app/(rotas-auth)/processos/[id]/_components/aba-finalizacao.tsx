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
import * as finalizacao from '@/services/finalizacao';
import { IConclusao } from '@/types/finalizacao';
import { IProcesso } from '@/types/processos';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import CardPrazoFase from './card-prazo-fase';

function hojeInput() {
	return new Date().toISOString().split('T')[0];
}

function toInputDate(valor?: string | Date | null) {
	if (!valor) return hojeInput();
	const d = new Date(valor);
	if (Number.isNaN(d.getTime())) return hojeInput();
	return d.toISOString().split('T')[0];
}

export default function AbaFinalizacao({
	processo,
	conclusao,
}: {
	processo: IProcesso;
	conclusao?: IConclusao | null;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const finalizado = Boolean(conclusao?.data_conclusao);
	const deferido = processo.status === 3;

	const [dataApostilamento, setDataApostilamento] = useState(
		toInputDate(conclusao?.data_apostilamento),
	);
	const [dataConclusao, setDataConclusao] = useState(
		toInputDate(conclusao?.data_conclusao),
	);
	const [dataEmissao, setDataEmissao] = useState(
		toInputDate(conclusao?.data_emissao),
	);
	const [dataOutorga, setDataOutorga] = useState(
		toInputDate(conclusao?.data_outorga),
	);
	const [dataResposta, setDataResposta] = useState(
		toInputDate(conclusao?.data_resposta),
	);
	const [dataTermo, setDataTermo] = useState(toInputDate(conclusao?.data_termo));
	const [numAlvara, setNumAlvara] = useState(conclusao?.num_alvara ?? '');
	const [obs, setObs] = useState(conclusao?.obs ?? '');
	const [outorga, setOutorga] = useState(
		conclusao?.outorga === false ? 'false' : 'true',
	);

	if (!deferido) {
		return (
			<Card>
				<CardContent className='py-8 text-center text-muted-foreground text-sm'>
					A finalização está disponível apenas para processos deferidos na
					análise técnica. Registre a decisão de deferimento na aba{' '}
					<Link
						href={`/processos/${processo.id}?tab=analise`}
						className='text-primary hover:underline'>
						Análise
					</Link>
					.
				</CardContent>
			</Card>
		);
	}

	function salvar() {
		if (!numAlvara.trim()) {
			toast.error('Informe o número do alvará');
			return;
		}

		startTransition(async () => {
			const payload = {
				inicial_id: processo.id,
				data_apostilamento: dataApostilamento,
				data_conclusao: dataConclusao,
				data_emissao: dataEmissao,
				data_outorga: dataOutorga,
				data_resposta: dataResposta,
				data_termo: dataTermo,
				num_alvara: numAlvara.trim(),
				obs,
				outorga: outorga === 'true',
			};

			const res = await finalizacao.criar(payload);
			if (res.ok) {
				toast.success('Finalização registrada com sucesso');
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao finalizar');
			}
		});
	}

	return (
		<form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
			<CardPrazoFase
				fase='finalizacao'
				processo={processo}
				conclusao={conclusao}
			/>
			<Card>
				<CardHeader>
					<CardTitle>Finalização</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Preencha os dados de emissão do alvará. A decisão de deferimento ou
						indeferimento é registrada na aba Análise técnica.
					</p>
					<div className='grid gap-2'>
						<Label>Processo (SEI)</Label>
						<Input value={formatarSei(processo.sei)} readOnly />
					</div>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						<CampoData
							label='Data apostilamento'
							value={dataApostilamento}
							onChange={setDataApostilamento}
							disabled={finalizado}
						/>
						<CampoData
							label='Data conclusão'
							value={dataConclusao}
							onChange={setDataConclusao}
							disabled={finalizado}
						/>
						<CampoData
							label='Data emissão'
							value={dataEmissao}
							onChange={setDataEmissao}
							disabled={finalizado}
						/>
						<CampoData
							label='Data outorga'
							value={dataOutorga}
							onChange={setDataOutorga}
							disabled={finalizado}
						/>
						<CampoData
							label='Data resposta'
							value={dataResposta}
							onChange={setDataResposta}
							disabled={finalizado}
						/>
						<CampoData
							label='Data termo'
							value={dataTermo}
							onChange={setDataTermo}
							disabled={finalizado}
						/>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label>Nº alvará</Label>
							<Input
								value={numAlvara}
								onChange={(e) => setNumAlvara(e.target.value)}
								disabled={finalizado}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label>Outorga</Label>
							<Select
								value={outorga}
								onValueChange={setOutorga}
								disabled={finalizado}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='true'>Sim</SelectItem>
									<SelectItem value='false'>Não</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='space-y-2'>
						<Label>Observação</Label>
						<Textarea
							value={obs}
							onChange={(e) => setObs(e.target.value)}
							disabled={finalizado}
							rows={3}
						/>
					</div>
					{finalizado && (
						<p className='text-sm text-muted-foreground'>
							Processo já finalizado. Os dados acima são somente leitura.
						</p>
					)}
					<div className='flex justify-end pt-2'>
						<Button
							type='button'
							disabled={finalizado || isPending}
							onClick={salvar}>
							Salvar finalização
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}

function CampoData({
	label,
	value,
	onChange,
	disabled,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	disabled?: boolean;
}) {
	return (
		<div className='space-y-2'>
			<Label>{label}</Label>
			<Input
				type='date'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
			/>
		</div>
	);
}
