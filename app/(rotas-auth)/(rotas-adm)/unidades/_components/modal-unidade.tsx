/** @format */

'use client';

import { Button } from '@/components/ui/button';
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
import * as unidades from '@/services/unidades';
import { IUnidades, NIVEL_LABEL, NivelUnidade } from '@/types/unidades';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';
import { toast } from 'sonner';

const NIVEIS: NivelUnidade[] = ['COORDENADORIA', 'DIRETORIA', 'UNIDADE'];

/** Nível exigido para o pai de cada nível (null = raiz). */
const NIVEL_PAI: Record<NivelUnidade, NivelUnidade | null> = {
	COORDENADORIA: null,
	DIRETORIA: 'COORDENADORIA',
	UNIDADE: 'DIRETORIA',
};

/** Nível dos filhos de um nível (null = folha). */
export function nivelFilho(n: NivelUnidade): NivelUnidade | null {
	return n === 'COORDENADORIA' ? 'DIRETORIA' : n === 'DIRETORIA' ? 'UNIDADE' : null;
}

export default function ModalUnidade({
	item,
	isUpdating = false,
	todas,
	pai,
	trigger,
}: {
	item?: IUnidades;
	isUpdating?: boolean;
	/** Todas as unidades (para montar as opções de pai). */
	todas: IUnidades[];
	/** Unidade pai pré-definida (ao adicionar uma filha). */
	pai?: IUnidades;
	/** Gatilho customizado; se ausente usa o padrão (+ ou lápis). */
	trigger?: ReactNode;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const nivelInicial: NivelUnidade =
		item?.nivel ?? (pai ? nivelFilho(pai.nivel) ?? 'UNIDADE' : 'COORDENADORIA');

	const [nivel, setNivel] = useState<NivelUnidade>(nivelInicial);
	const [paiId, setPaiId] = useState<string>(
		item?.unidade_pai_id ?? pai?.id ?? '',
	);
	const [form, setForm] = useState({
		codigo: item?.codigo ?? '',
		sigla: item?.sigla ?? '',
		nome: item?.nome ?? '',
	});
	const [isPending, startTransition] = useTransition();

	function reset() {
		setNivel(nivelInicial);
		setPaiId(item?.unidade_pai_id ?? pai?.id ?? '');
		setForm({
			codigo: item?.codigo ?? '',
			sigla: item?.sigla ?? '',
			nome: item?.nome ?? '',
		});
	}

	const paiEsperado = NIVEL_PAI[nivel];
	const opcoesPai = paiEsperado
		? todas.filter((u) => u.nivel === paiEsperado && u.id !== item?.id)
		: [];

	function handleSalvar() {
		if (!form.nome.trim()) {
			toast.error('Informe o nome');
			return;
		}
		if (paiEsperado && !paiId) {
			toast.error(`Selecione a ${NIVEL_LABEL[paiEsperado].toLowerCase()} pai`);
			return;
		}
		startTransition(async () => {
			const payload = {
				nome: form.nome.trim(),
				sigla: form.sigla.trim(),
				codigo: form.codigo.trim(),
				nivel,
				unidade_pai_id: paiEsperado ? paiId : null,
			};
			const response =
				isUpdating && item
					? await unidades.atualizar(item.id, payload)
					: await unidades.criar({ ...payload, status: 1 });
			if (response.ok) {
				toast.success(isUpdating ? 'Unidade atualizada' : 'Unidade criada');
				setOpen(false);
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao salvar');
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v) reset();
			}}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button
						size='icon'
						variant='default'
						className={
							isUpdating
								? 'h-8 w-8 bg-primary text-white hover:bg-primary/80'
								: 'bg-primary hover:bg-primary hover:opacity-70 h-10 w-10 rounded-full shadow-sm'
						}>
						{isUpdating ? <SquarePen className='text-white' /> : <Plus className='text-white' />}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isUpdating
							? `Editar ${NIVEL_LABEL[nivelInicial].toLowerCase()}`
							: `Nova ${NIVEL_LABEL[nivelInicial].toLowerCase()}`}
					</DialogTitle>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Nível</Label>
						<Select
							value={nivel}
							onValueChange={(v) => {
								setNivel(v as NivelUnidade);
								setPaiId('');
							}}
							disabled={!!pai}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{NIVEIS.map((n) => (
									<SelectItem key={n} value={n}>
										{NIVEL_LABEL[n]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{paiEsperado && (
						<div>
							<Label>{NIVEL_LABEL[paiEsperado]} pai</Label>
							<Select value={paiId} onValueChange={setPaiId} disabled={!!pai}>
								<SelectTrigger>
									<SelectValue
										placeholder={`Selecione a ${NIVEL_LABEL[paiEsperado].toLowerCase()}`}
									/>
								</SelectTrigger>
								<SelectContent>
									{opcoesPai.length === 0 && (
										<div className='px-2 py-1.5 text-sm text-muted-foreground'>
											Nenhuma {NIVEL_LABEL[paiEsperado].toLowerCase()} cadastrada
										</div>
									)}
									{opcoesPai.map((u) => (
										<SelectItem key={u.id} value={u.id}>
											{u.sigla ? `${u.sigla} - ${u.nome}` : u.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					<div>
						<Label>Nome</Label>
						<Input
							value={form.nome}
							onChange={(e) => setForm({ ...form, nome: e.target.value })}
						/>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<div>
							<Label>Sigla</Label>
							<Input
								value={form.sigla}
								onChange={(e) => setForm({ ...form, sigla: e.target.value })}
							/>
						</div>
						<div>
							<Label>Código</Label>
							<Input
								value={form.codigo}
								onChange={(e) => setForm({ ...form, codigo: e.target.value })}
							/>
						</div>
					</div>
				</div>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
