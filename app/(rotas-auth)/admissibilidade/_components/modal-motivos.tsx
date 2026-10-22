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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as parecerAdmissibilidade from '@/services/parecer-admissibilidade';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { Check, List, Loader2, Pencil, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ModalMotivosProps {
	compact?: boolean;
	onMotivoCriado?: () => void;
}

export default function ModalMotivos({
	compact = false,
	onMotivoCriado,
}: ModalMotivosProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [pareceres, setPareceres] = useState<IParecerAdmissibilidade[]>([]);
	const [texto, setTexto] = useState('');
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [carregando, setCarregando] = useState(false);
	const [isPending, startTransition] = useTransition();

	async function carregarPareceres() {
		setCarregando(true);
		const lista = await parecerAdmissibilidade.buscarLista();
		setPareceres(lista);
		setCarregando(false);
	}

	useEffect(() => {
		if (open) carregarPareceres();
	}, [open]);

	function resetFormulario() {
		setTexto('');
		setEditandoId(null);
	}

	function handleSalvar() {
		if (!texto.trim()) {
			toast.error('Informe o texto do motivo');
			return;
		}

		startTransition(async () => {
			const response = editandoId
				? await parecerAdmissibilidade.atualizar(editandoId, texto.trim())
				: await parecerAdmissibilidade.criar({
						parecer: texto.trim(),
						status: 1,
					});

			if (response.ok) {
				toast.success(
					editandoId ? 'Motivo atualizado' : 'Motivo criado com sucesso',
				);
				resetFormulario();
				await carregarPareceres();
				router.refresh();
				onMotivoCriado?.();
				return;
			}

			toast.error(response.error ?? 'Erro ao salvar motivo');
		});
	}

	function handleDesativar(id: string) {
		startTransition(async () => {
			const response = await parecerAdmissibilidade.desativar(id);
			if (response.ok) {
				toast.success('Motivo desativado');
				await carregarPareceres();
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao desativar motivo');
		});
	}

	const ativos = pareceres.filter((p) => p.status === 1);
	const inativos = pareceres.filter((p) => p.status === 0);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{compact ? (
					<Button variant='link' size='sm' className='h-auto p-0 text-xs'>
						Gerenciar motivos
					</Button>
				) : (
					<Button variant='outline' size='sm'>
						<List className='mr-2 h-4 w-4' />
						Motivos
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>Motivos de inadmissão</DialogTitle>
					<DialogDescription>
						Cadastre e gerencie os motivos utilizados na inadmissão de
						processos.
					</DialogDescription>
				</DialogHeader>

				<div className='flex gap-2'>
					<Input
						placeholder='Digite o texto do motivo'
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

				{carregando ? (
					<div className='flex items-center gap-2 text-sm text-muted-foreground py-4'>
						<Loader2 className='h-4 w-4 animate-spin' />
						Carregando...
					</div>
				) : (
					<Tabs defaultValue='ativos'>
						<TabsList className='w-full'>
							<TabsTrigger value='ativos' className='flex-1'>
								Ativos ({ativos.length})
							</TabsTrigger>
							<TabsTrigger value='inativos' className='flex-1'>
								Inativos ({inativos.length})
							</TabsTrigger>
						</TabsList>
						<TabsContent value='ativos' className='max-h-60 overflow-y-auto'>
							{ativos.length === 0 ? (
								<p className='text-sm text-muted-foreground py-4 text-center'>
									Nenhum motivo cadastrado
								</p>
							) : (
								<ul className='divide-y'>
									{ativos.map((item) => (
										<li
											key={item.id}
											className='flex items-center justify-between py-2 gap-2'>
											<span className='text-sm'>{item.parecer}</span>
											<div className='flex gap-1 shrink-0'>
												<Button
													size='icon'
													variant='ghost'
													onClick={() => {
														setEditandoId(item.id);
														setTexto(item.parecer);
													}}>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													size='icon'
													variant='ghost'
													className='text-destructive'
													onClick={() => handleDesativar(item.id)}>
													<X className='h-4 w-4' />
												</Button>
											</div>
										</li>
									))}
								</ul>
							)}
						</TabsContent>
						<TabsContent value='inativos' className='max-h-60 overflow-y-auto'>
							{inativos.length === 0 ? (
								<p className='text-sm text-muted-foreground py-4 text-center'>
									Nenhum motivo inativo
								</p>
							) : (
								<ul className='divide-y'>
									{inativos.map((item) => (
										<li key={item.id} className='py-2 text-sm text-muted-foreground'>
											{item.parecer}
										</li>
									))}
								</ul>
							)}
						</TabsContent>
					</Tabs>
				)}
			</DialogContent>
		</Dialog>
	);
}
