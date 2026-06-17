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
import * as coordenadorias from '@/services/coordenadorias';
import { ICoordenadoria } from '@/types/coordenadorias';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalCoordenadoria({
	item,
	isUpdating = false,
}: {
	item?: ICoordenadoria;
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
					? await coordenadorias.atualizar(item.id, {
							nome: nome.trim(),
							sigla: sigla.trim(),
						})
					: await coordenadorias.criar({
							nome: nome.trim(),
							sigla: sigla.trim(),
						});
			if (response.ok) {
				toast.success(isUpdating ? 'Coordenadoria atualizada' : 'Coordenadoria criada');
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
					<DialogTitle>{isUpdating ? 'Editar' : 'Nova'} coordenadoria</DialogTitle>
					<DialogDescription>Coordenadoria organizacional.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Sigla</Label>
						<Input value={sigla} onChange={(e) => setSigla(e.target.value)} />
					</div>
					<div>
						<Label>Nome</Label>
						<Input value={nome} onChange={(e) => setNome(e.target.value)} />
					</div>
				</div>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
