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
import * as subprefeitura from '@/services/subprefeituras';
import { ISubprefeitura } from '@/types/subprefeituras';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalSubprefeitura({
	item,
	isUpdating = false,
}: {
	item?: ISubprefeitura;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [nome, setNome] = useState(item?.nome ?? '');
	const [sigla, setSigla] = useState(item?.sigla ?? '');
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!nome.trim() || !sigla.trim()) {
			toast.error('Preencha nome e sigla');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await subprefeitura.atualizar(item.id, {
							nome: nome.trim(),
							sigla: sigla.trim(),
						})
					: await subprefeitura.criar({
							nome: nome.trim(),
							sigla: sigla.trim(),
							status: 1,
						});
			if (response.ok) {
				toast.success(isUpdating ? 'Subprefeitura atualizada' : 'Subprefeitura criada');
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
				if (v && item) {
					setNome(item.nome);
					setSigla(item.sigla);
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
					<DialogTitle>{isUpdating ? 'Editar' : 'Nova'} subprefeitura</DialogTitle>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Nome</Label>
						<Input value={nome} onChange={(e) => setNome(e.target.value)} />
					</div>
					<div>
						<Label>Sigla</Label>
						<Input value={sigla} onChange={(e) => setSigla(e.target.value)} />
					</div>
				</div>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
