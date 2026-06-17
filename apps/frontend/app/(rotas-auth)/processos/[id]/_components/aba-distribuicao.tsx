/** @format */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as distribuicao from '@/services/distribuicao';
import { IDistribuicao } from '@/types/distribuicao';
import { IProcesso } from '@/types/processos';
import { IUsuario } from '@/types/usuario';
import CardPrazoFase from './card-prazo-fase';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function AbaDistribuicao({
	processo,
	distribuicao: dist,
	inicialId,
	administrativos,
	tecnicos,
	podeEditar,
}: {
	processo: IProcesso;
	distribuicao?: IDistribuicao | null;
	inicialId: number;
	administrativos: IUsuario[];
	tecnicos: IUsuario[];
	podeEditar: boolean;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [adminId, setAdminId] = useState(
		dist?.administrativo_responsavel_id ?? '',
	);
	const [tecId, setTecId] = useState(dist?.tecnico_responsavel_id ?? '');

	if (!dist) {
		return (
			<div className='space-y-4'>
				<CardPrazoFase fase='distribuicao' processo={processo} />
				<Card>
					<CardContent className='py-8 text-center text-muted-foreground'>
						Distribuição ainda não registrada para este processo.
					</CardContent>
				</Card>
			</div>
		);
	}

	function salvarAdministrativo(value: string) {
		setAdminId(value);
		startTransition(async () => {
			const res = await distribuicao.mudarAdministrativo(inicialId, value);
			if (res.ok) {
				toast.success('Administrativo responsável atualizado');
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao atualizar');
			}
		});
	}

	function salvarTecnico(value: string) {
		setTecId(value);
		startTransition(async () => {
			const res = await distribuicao.mudarTecnico(inicialId, value);
			if (res.ok) {
				toast.success('Técnico responsável atualizado');
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao atualizar');
			}
		});
	}

	return (
		<div className='space-y-4'>
			<CardPrazoFase fase='distribuicao' processo={processo} />
		<Card>
			<CardHeader>
				<CardTitle>Distribuição</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-6 sm:grid-cols-2'>
				<div className='space-y-2'>
					<Label>Administrativo responsável</Label>
					<Select
						value={adminId}
						onValueChange={salvarAdministrativo}
						disabled={!podeEditar || isPending}>
						<SelectTrigger>
							<SelectValue placeholder='Selecione' />
						</SelectTrigger>
						<SelectContent>
							{administrativos.map((u) => (
								<SelectItem key={u.id} value={u.id}>
									{u.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label>Técnico responsável</Label>
					<Select
						value={tecId || undefined}
						onValueChange={salvarTecnico}
						disabled={!podeEditar || isPending}>
						<SelectTrigger>
							<SelectValue placeholder='Selecione' />
						</SelectTrigger>
						<SelectContent>
							{tecnicos.map((t) => (
								<SelectItem key={t.id} value={t.id}>
									{t.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{dist.obs && (
					<div className='sm:col-span-2'>
						<Label>Observações</Label>
						<p className='text-sm mt-1'>{dist.obs}</p>
					</div>
				)}
			</CardContent>
		</Card>
		</div>
	);
}
