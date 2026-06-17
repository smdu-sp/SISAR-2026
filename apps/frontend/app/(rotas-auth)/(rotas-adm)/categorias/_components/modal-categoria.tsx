/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as categorias from '@/services/categorias';
import { ICategoria } from '@/types/categorias';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalCategoria({
	item,
	isUpdating = false,
}: {
	item?: ICategoria;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		categoria: item?.categoria ?? '',
		descricao: item?.descricao ?? '',
		divisao: item?.divisao ?? '',
		competencia: item?.competencia ?? '',
	});
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!form.categoria.trim()) {
			toast.error('Informe o nome da categoria');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await categorias.atualizar(item.id, form)
					: await categorias.criar(form);
			if (response.ok) {
				toast.success(isUpdating ? 'Categoria atualizada' : 'Categoria criada');
				setOpen(false);
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao salvar categoria');
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v && item) {
					setForm({
						categoria: item.categoria,
						descricao: item.descricao,
						divisao: item.divisao,
						competencia: item.competencia,
					});
				}
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
					<DialogTitle>{isUpdating ? 'Editar' : 'Nova'} categoria</DialogTitle>
					<DialogDescription>Categoria de uso dos processos.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Categoria</Label>
						<Input
							value={form.categoria}
							onChange={(e) => setForm({ ...form, categoria: e.target.value })}
						/>
					</div>
					<div>
						<Label>Descrição</Label>
						<Input
							value={form.descricao}
							onChange={(e) => setForm({ ...form, descricao: e.target.value })}
						/>
					</div>
					<div>
						<Label>Divisão</Label>
						<Input
							value={form.divisao}
							onChange={(e) => setForm({ ...form, divisao: e.target.value })}
						/>
					</div>
					<div>
						<Label>Competência</Label>
						<Input
							value={form.competencia}
							onChange={(e) => setForm({ ...form, competencia: e.target.value })}
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
