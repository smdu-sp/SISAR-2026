/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatarSei } from '@/lib/utils';
import * as admissibilidade from '@/services/admissibilidade';
import * as parecerAdmissibilidade from '@/services/parecer-admissibilidade';
import { IParecerAdmissibilidade } from '@/types/parecer-admissibilidade';
import { Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ModalInadmitirProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	inicialId: number;
	sei: string;
}

export default function ModalInadmitir({
	open,
	onOpenChange,
	inicialId,
	sei,
}: ModalInadmitirProps) {
	const router = useRouter();
	const [pareceres, setPareceres] = useState<IParecerAdmissibilidade[]>([]);
	const [parecerId, setParecerId] = useState('');
	const [carregandoPareceres, setCarregandoPareceres] = useState(false);
	const [isPending, startTransition] = useTransition();

	async function carregarPareceres() {
		setCarregandoPareceres(true);
		const lista = await parecerAdmissibilidade.buscarAtivos();
		setPareceres(lista);
		setCarregandoPareceres(false);
	}

	useEffect(() => {
		if (open) {
			setParecerId('');
			carregarPareceres();
		}
	}, [open, inicialId]);

	function handleInadmitir() {
		if (!parecerId) {
			toast.error('Selecione um motivo');
			return;
		}

		startTransition(async () => {
			const response = await admissibilidade.atualizar(inicialId, {
				status: 3,
				parecer_admissibilidade_id: parecerId,
				data_decisao_interlocutoria: new Date().toISOString(),
			});

			if (response.ok) {
				toast.success('Processo inadmitido com sucesso');
				onOpenChange(false);
				setParecerId('');
				router.refresh();
				return;
			}

			toast.error(response.error ?? 'Erro ao inadmitir processo');
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Inadmitir processo</DialogTitle>
					<DialogDescription>
						Preencha os dados para inadmitir o processo.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-2'>
					<div className='grid gap-2'>
						<p className='text-sm font-medium'>SEI</p>
						<Input value={formatarSei(sei)} readOnly />
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center justify-between gap-2'>
							<p className='text-sm font-medium'>Motivo</p>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								className='h-auto px-2 text-xs'
								onClick={carregarPareceres}
								disabled={carregandoPareceres}>
								<RefreshCw
									className={`mr-1 h-3 w-3 ${carregandoPareceres ? 'animate-spin' : ''}`}
								/>
								Atualizar
							</Button>
						</div>
						{carregandoPareceres ? (
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Carregando motivos...
							</div>
						) : pareceres.length === 0 ? (
							<p className='text-sm text-muted-foreground'>
								Nenhum motivo ativo cadastrado. Use o botão{' '}
								<strong>Motivos</strong> acima da tabela para cadastrar.
							</p>
						) : (
							<Select value={parecerId} onValueChange={setParecerId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione o motivo' />
								</SelectTrigger>
								<SelectContent>
									{pareceres.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.parecer}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
				</div>
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isPending}>
						Cancelar
					</Button>
					<Button
						type='button'
						onClick={handleInadmitir}
						disabled={isPending || pareceres.length === 0}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Enviar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
