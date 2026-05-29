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
	DialogTrigger,
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
import { Hand, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import ModalMotivos from './modal-motivos';

interface ModalInadmitirProps {
	inicialId: number;
	sei: string;
}

export default function ModalInadmitir({ inicialId, sei }: ModalInadmitirProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
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
		if (open) carregarPareceres();
	}, [open]);

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
				setOpen(false);
				setParecerId('');
				router.refresh();
				return;
			}

			toast.error(response.error ?? 'Erro ao inadmitir processo');
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant='outline'
					className='text-amber-600 hover:text-amber-700'
					title='Inadmitir'>
					<Hand className='h-4 w-4' />
				</Button>
			</DialogTrigger>
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
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium'>Motivo</p>
							<ModalMotivos compact onMotivoCriado={carregarPareceres} />
						</div>
						{carregandoPareceres ? (
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Carregando motivos...
							</div>
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
						variant='outline'
						onClick={() => setOpen(false)}
						disabled={isPending}>
						Cancelar
					</Button>
					<Button onClick={handleInadmitir} disabled={isPending}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Enviar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
