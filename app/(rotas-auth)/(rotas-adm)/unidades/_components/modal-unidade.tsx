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
import * as unidades from '@/services/unidades';
import { IUnidades } from '@/types/unidades';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalUnidade({
	item,
	isUpdating = false,
}: {
	item?: IUnidades;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		codigo: item?.codigo ?? '',
		sigla: item?.sigla ?? '',
		nome: item?.nome ?? '',
	});
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!form.codigo || !form.sigla || !form.nome) {
			toast.error('Preencha todos os campos');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await unidades.atualizar(item.id, form)
					: await unidades.criar({ ...form, status: 1 });
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
				if (v && item) setForm({ codigo: item.codigo, sigla: item.sigla, nome: item.nome });
			}}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant={isUpdating ? 'outline' : 'default'}
					className={
						isUpdating
							? ''
							: 'bg-primary hover:bg-primary hover:opacity-70 h-12 w-12 rounded-full shadow-lg'
					}>
					{isUpdating ? <SquarePen /> : <Plus className='text-white' />}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar' : 'Nova'} unidade</DialogTitle>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Código</Label>
						<Input
							value={form.codigo}
							onChange={(e) => setForm({ ...form, codigo: e.target.value })}
						/>
					</div>
					<div>
						<Label>Sigla</Label>
						<Input
							value={form.sigla}
							onChange={(e) => setForm({ ...form, sigla: e.target.value })}
						/>
					</div>
					<div>
						<Label>Nome</Label>
						<Input
							value={form.nome}
							onChange={(e) => setForm({ ...form, nome: e.target.value })}
						/>
					</div>
				</div>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
