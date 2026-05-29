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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as diretorias from '@/services/diretorias';
import { ICoordenadoriaSelect } from '@/types/coordenadorias';
import { IDiretoria } from '@/types/diretorias';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalDiretoria({
	item,
	isUpdating = false,
	coordenadorias = [],
}: {
	item?: IDiretoria;
	isUpdating?: boolean;
	coordenadorias?: ICoordenadoriaSelect[];
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [nome, setNome] = useState(item?.nome ?? '');
	const [coordenadoriaId, setCoordenadoriaId] = useState(
		item?.coordenadoria_id ?? '',
	);
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!nome.trim() || !coordenadoriaId) {
			toast.error('Preencha nome e coordenadoria');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await diretorias.atualizar(item.id, {
							nome: nome.trim(),
							coordenadoria_id: coordenadoriaId,
						})
					: await diretorias.criar({
							nome: nome.trim(),
							coordenadoria_id: coordenadoriaId,
						});
			if (response.ok) {
				toast.success(isUpdating ? 'Diretoria atualizada' : 'Diretoria criada');
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
					setCoordenadoriaId(item.coordenadoria_id);
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
					<DialogTitle>{isUpdating ? 'Editar' : 'Nova'} diretoria</DialogTitle>
					<DialogDescription>Diretoria vinculada a uma coordenadoria.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<div>
						<Label>Coordenadoria</Label>
						<Select value={coordenadoriaId} onValueChange={setCoordenadoriaId}>
							<SelectTrigger>
								<SelectValue placeholder='Selecione' />
							</SelectTrigger>
							<SelectContent>
								{coordenadorias.map((c) => (
									<SelectItem key={c.value} value={c.value}>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
