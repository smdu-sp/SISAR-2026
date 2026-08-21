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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import * as avisos from '@/services/avisos';
import { Bell, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

/** Constrói uma Date local a partir de "yyyy-mm-dd" (evita erro de fuso). */
function dataLocal(valor: string): Date {
	const [ano, mes, dia] = valor.split('-').map(Number);
	return new Date(ano, (mes || 1) - 1, dia || 1);
}

export default function ModalLembrete({ inicialId }: { inicialId: number }) {
	const { data: session } = useSession();
	const [aberto, setAberto] = useState(false);
	const [titulo, setTitulo] = useState('');
	const [descricao, setDescricao] = useState('');
	const [data, setData] = useState(new Date().toISOString().split('T')[0]);
	const [tipo, setTipo] = useState('0'); // 0 = geral, 1 = pessoal
	const [isPending, startTransition] = useTransition();

	function resetar() {
		setTitulo('');
		setDescricao('');
		setData(new Date().toISOString().split('T')[0]);
		setTipo('0');
	}

	function salvar() {
		const token = session?.access_token;
		if (!token) {
			toast.error('Não autorizado');
			return;
		}
		if (!titulo.trim()) {
			toast.error('Informe o título do lembrete');
			return;
		}
		startTransition(async () => {
			const resultado = await avisos.criar(token, {
				titulo: titulo.trim(),
				descricao: descricao.trim(),
				data: dataLocal(data),
				inicial_id: inicialId,
				tipo: parseInt(tipo, 10),
			});
			if (resultado) {
				toast.success('Lembrete criado', {
					description:
						parseInt(tipo, 10) === 1
							? 'Visível apenas para você, na Agenda.'
							: 'Visível para todos, na Agenda.',
				});
				resetar();
				setAberto(false);
			} else {
				toast.error('Erro ao criar lembrete');
			}
		});
	}

	return (
		<Dialog open={aberto} onOpenChange={setAberto}>
			<DialogTrigger asChild>
				<Button size='sm' className='gap-1.5 flex-1 md:flex-none'>
					<Bell size={14} /> Criar lembrete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Criar lembrete</DialogTitle>
					<DialogDescription>
						O lembrete fica vinculado a este processo e aparece na Agenda na
						data escolhida.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-2'>
					<div className='grid gap-2'>
						<Label htmlFor='lembrete-titulo'>Título</Label>
						<Input
							id='lembrete-titulo'
							value={titulo}
							onChange={(e) => setTitulo(e.target.value)}
							placeholder='Ex.: Cobrar resposta do munícipe'
						/>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='lembrete-descricao'>Descrição</Label>
						<Textarea
							id='lembrete-descricao'
							value={descricao}
							onChange={(e) => setDescricao(e.target.value)}
							rows={3}
							placeholder='Detalhes do lembrete (opcional)'
						/>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='grid gap-2'>
							<Label htmlFor='lembrete-data'>Data</Label>
							<Input
								id='lembrete-data'
								type='date'
								value={data}
								onChange={(e) => setData(e.target.value)}
							/>
						</div>
						<div className='grid gap-2'>
							<Label>Tipo</Label>
							<Select value={tipo} onValueChange={setTipo}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='0'>Geral (todos veem)</SelectItem>
									<SelectItem value='1'>Pessoal (só você)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => setAberto(false)}
						disabled={isPending}>
						Cancelar
					</Button>
					<Button type='button' onClick={salvar} disabled={isPending}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Criar lembrete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
