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
import { formatarSei } from '@/lib/utils';
import * as processos from '@/services/processos';
import { IProcesso } from '@/types/processos';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ModalNovoProcesso() {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [sei, setSei] = useState('');
	const [processoExistente, setProcessoExistente] = useState<IProcesso | null>(
		null,
	);
	const [verificando, setVerificando] = useState(false);

	const seiLimpo = sei.replace(/\D/g, '');
	const seiValido = seiLimpo.length === 16;

	async function handleSeiChange(value: string) {
		const formatado = formatarSei(value);
		setSei(formatado);
		setProcessoExistente(null);

		const numeros = formatado.replace(/\D/g, '');
		if (numeros.length === 16 && session?.access_token) {
			setVerificando(true);
			const response = await processos.verificaSei(
				session.access_token,
				numeros,
			);
			if (response.ok && response.data) {
				setProcessoExistente(response.data as IProcesso);
			}
			setVerificando(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='icon' className='rounded-full h-12 w-12 shadow-lg'>
					<Plus className='h-5 w-5' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novo processo</DialogTitle>
					<DialogDescription>
						Informe o número SEI para localizar ou cadastrar um processo.
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 pt-2'>
					<div className='space-y-2'>
						<Label htmlFor='sei'>SEI</Label>
						<Input
							id='sei'
							value={sei}
							onChange={(e) => handleSeiChange(e.target.value)}
							placeholder='0000.0000/0000000-0'
						/>
						{sei.length > 0 && !seiValido && (
							<p className='text-sm text-muted-foreground'>
								O SEI deve conter 16 dígitos.
							</p>
						)}
						{verificando && (
							<p className='text-sm text-muted-foreground'>Verificando...</p>
						)}
						{processoExistente && (
							<p className='text-sm'>
								Processo já cadastrado:{' '}
								<Link
									href={`/processos/${processoExistente.id}`}
									className='text-primary underline'
									onClick={() => setOpen(false)}>
									#{processoExistente.id}
								</Link>
							</p>
						)}
					</div>
					{seiValido && !processoExistente && (
						<Button asChild className='w-full'>
							<Link
								href={`/processos/novo?sei=${seiLimpo}`}
								onClick={() => setOpen(false)}>
								Cadastrar novo processo
							</Link>
						</Button>
					)}
					{processoExistente && (
						<Button asChild variant='secondary' className='w-full'>
							<Link
								href={`/processos/${processoExistente.id}`}
								onClick={() => setOpen(false)}>
								Abrir processo existente
							</Link>
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
