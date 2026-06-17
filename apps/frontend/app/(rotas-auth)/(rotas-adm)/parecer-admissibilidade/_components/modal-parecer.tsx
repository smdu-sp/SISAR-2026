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
import * as parecerAdmissibilidade from '@/services/parecer-admissibilidade';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalParecer({
	item,
	isUpdating = false,
}: {
	item?: IParecerAdmissibilidade;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [parecer, setParecer] = useState(item?.parecer ?? '');
	const [isPending, startTransition] = useTransition();

	function handleSalvar() {
		if (!parecer.trim()) {
			toast.error('Informe o texto do parecer');
			return;
		}
		startTransition(async () => {
			const response = isUpdating && item
				? await parecerAdmissibilidade.atualizar(item.id, parecer.trim())
				: await parecerAdmissibilidade.criar({ parecer: parecer.trim(), status: 1 });
			if (response.ok) {
				toast.success(isUpdating ? 'Parecer atualizado' : 'Parecer criado');
				setOpen(false);
				if (!isUpdating) setParecer('');
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao salvar parecer');
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v && item) setParecer(item.parecer);
				if (!v && !isUpdating) setParecer('');
			}}>
			<DialogTrigger asChild>
				<Button
					size={isUpdating ? 'icon' : 'icon'}
					variant={isUpdating ? 'outline' : 'default'}
					className={
						isUpdating
							? 'bg-background hover:bg-primary'
							: 'bg-primary hover:bg-primary hover:opacity-70 h-12 w-12 rounded-full shadow-lg'
					}>
					{isUpdating ? (
						<SquarePen className='text-primary' />
					) : (
						<Plus className='text-white' />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar' : 'Novo'} parecer</DialogTitle>
					<DialogDescription>
						Pareceres utilizados na análise de admissibilidade.
					</DialogDescription>
				</DialogHeader>
				<Input
					placeholder='Texto do parecer'
					value={parecer}
					onChange={(e) => setParecer(e.target.value)}
				/>
				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar
				</Button>
			</DialogContent>
		</Dialog>
	);
}
