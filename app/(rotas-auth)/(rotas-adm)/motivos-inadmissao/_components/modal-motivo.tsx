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
import * as motivos from '@/services/motivos-inadmissao';
import { IMotivoInadmissao } from '@/types/motivos-inadmissao';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalMotivo({
	item,
	isUpdating = false,
}: {
	item?: IMotivoInadmissao;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [descricao, setDescricao] = useState(item?.descricao ?? '');
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!descricao.trim()) {
			toast.error('Informe a descrição');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await motivos.atualizar(item.id, descricao.trim())
					: await motivos.criar(descricao.trim());
			if (response.ok) {
				toast.success(isUpdating ? 'Motivo atualizado' : 'Motivo criado');
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
				if (v && item) setDescricao(item.descricao);
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
					<DialogTitle>{isUpdating ? 'Editar' : 'Novo'} motivo</DialogTitle>
					<DialogDescription>Motivo de inadmissão do processo.</DialogDescription>
				</DialogHeader>
				<Input
					placeholder='Descrição do motivo'
					value={descricao}
					onChange={(e) => setDescricao(e.target.value)}
				/>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
