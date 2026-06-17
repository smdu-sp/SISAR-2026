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
import { Check, Loader2, Pencil, Plus, SquarePen, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState, useTransition } from 'react';
import { toast } from 'sonner';

export interface ICadastroItem {
	id: string;
}

interface CadastroListaProps<T extends ICadastroItem> {
	tituloDialog: string;
	descricaoDialog: string;
	placeholder: string;
	itens: T[];
	renderLabel: (item: T) => string;
	onSalvar: (valor: string, editandoId: string | null) => Promise<{ ok: boolean; error?: string | null }>;
	onRemover?: (id: string) => Promise<{ ok: boolean; error?: string | null }>;
	camposExtras?: ReactNode;
	validate?: (valor: string) => string | null;
}

export function ModalCadastroLista<T extends ICadastroItem>({
	tituloDialog,
	descricaoDialog,
	placeholder,
	itens,
	renderLabel,
	onSalvar,
	onRemover,
	camposExtras,
	validate,
}: CadastroListaProps<T>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [texto, setTexto] = useState('');
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function resetFormulario() {
		setTexto('');
		setEditandoId(null);
	}

	function handleSalvar() {
		const erro = validate?.(texto.trim()) ?? (!texto.trim() ? 'Preencha o campo obrigatório' : null);
		if (erro) {
			toast.error(erro);
			return;
		}

		startTransition(async () => {
			const response = await onSalvar(texto.trim(), editandoId);
			if (response.ok) {
				toast.success(editandoId ? 'Registro atualizado' : 'Registro criado');
				resetFormulario();
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao salvar');
		});
	}

	function handleRemover(id: string) {
		if (!onRemover) return;
		startTransition(async () => {
			const response = await onRemover(id);
			if (response.ok) {
				toast.success('Registro removido');
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao remover');
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					className='bg-primary hover:bg-primary hover:opacity-70 h-12 w-12 rounded-full shadow-lg'>
					{editandoId ? (
						<SquarePen className='text-white' />
					) : (
						<Plus className='text-white' />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>{tituloDialog}</DialogTitle>
					<DialogDescription>{descricaoDialog}</DialogDescription>
				</DialogHeader>
				{camposExtras}
				<div className='flex gap-2'>
					<Input
						placeholder={placeholder}
						value={texto}
						onChange={(e) => setTexto(e.target.value)}
					/>
					<Button onClick={handleSalvar} disabled={isPending}>
						{isPending ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : editandoId ? (
							<Check className='h-4 w-4' />
						) : (
							<Plus className='h-4 w-4' />
						)}
					</Button>
				</div>
				<ul className='divide-y max-h-72 overflow-y-auto'>
					{itens.length === 0 ? (
						<p className='text-sm text-muted-foreground py-4 text-center'>
							Nenhum registro cadastrado
						</p>
					) : (
						itens.map((item) => (
							<li
								key={item.id}
								className='flex items-center justify-between py-2 gap-2'>
								<span className='text-sm'>{renderLabel(item)}</span>
								<div className='flex gap-1 shrink-0'>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => {
											setEditandoId(item.id);
											setTexto(renderLabel(item));
										}}>
										<Pencil className='h-4 w-4' />
									</Button>
									{onRemover && (
										<Button
											size='icon'
											variant='ghost'
											className='text-destructive'
											onClick={() => handleRemover(item.id)}>
											<Trash2 className='h-4 w-4' />
										</Button>
									)}
								</div>
							</li>
						))
					)}
				</ul>
			</DialogContent>
		</Dialog>
	);
}

export function BotaoCadastroFlutuante({ children }: { children: ReactNode }) {
	return (
		<div className='absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110 z-10'>
			{children}
		</div>
	);
}
