/** @format */
'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import * as usuario from '@/services/usuarios';
import { Loader2, UserCheck } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalAprovar({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition();

	async function handleAprovar() {
		const resp = await usuario.autorizar(id);
		if (!resp.ok) {
			toast.error('Algo deu errado', { description: resp.error });
		} else {
			toast.success('Usuário aprovado com sucesso');
			window.location.reload();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={'icon'}
					variant={'outline'}
					className='hover:bg-primary cursor-pointer hover:text-white group transition-all ease-linear duration-200'>
					<UserCheck
						size={24}
						className='text-primary dark:text-white group-hover:text-white group'
					/>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Aprovar usuário</DialogTitle>
				</DialogHeader>
				<p>Tem certeza que deseja aprovar o acesso desse usuário?</p>
				<DialogFooter>
					<div className='flex gap-2'>
						<DialogClose asChild>
							<Button
								id='close'
								variant={'outline'}>
								Voltar
							</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							onClick={() => startTransition(handleAprovar)}
							type='submit'>
							{isPending ? <Loader2 className='animate-spin' /> : 'Aprovar'}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
