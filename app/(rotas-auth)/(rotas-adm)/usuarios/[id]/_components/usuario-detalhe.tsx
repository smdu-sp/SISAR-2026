/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import * as usuarioService from '@/services/usuarios';
import { IPermissao, IUsuario } from '@/types/usuario';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const permissoesLabel: Record<string, string> = {
	DEV: 'Desenvolvedor',
	TEC: 'Técnico',
	ADM: 'Administrador',
	USR: 'Usuário',
	SUP: 'Superadmin',
};

export default function UsuarioDetalhe({
	usuario,
	unidades,
	administrativos,
}: {
	usuario: IUsuario & {
		ferias?: { id: string; inicio: string; final: string }[];
		substitutos?: { id: string; substituto?: { nome: string } }[];
	};
	unidades: { id: string; nome: string }[];
	administrativos: IUsuario[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [permissao, setPermissao] = useState(String(usuario.permissao));
	const [cargo, setCargo] = useState(usuario.cargo ?? 'ADM');
	const [unidadeId, setUnidadeId] = useState(usuario.unidade_id ?? '');

	const [modalFerias, setModalFerias] = useState(false);
	const [inicioFerias, setInicioFerias] = useState('');
	const [finalFerias, setFinalFerias] = useState('');

	const [modalSubstituto, setModalSubstituto] = useState(false);
	const [substitutoId, setSubstitutoId] = useState('');

	function salvarDados() {
		startTransition(async () => {
			const resp = await usuarioService.atualizar(usuario.id, {
				permissao: permissao as unknown as IPermissao,
				cargo,
				unidade_id: unidadeId || undefined,
			});
			if (resp.ok) {
				toast.success('Usuário atualizado');
				router.refresh();
			} else {
				toast.error(resp.error ?? 'Erro ao atualizar');
			}
		});
	}

	async function adicionarFerias() {
		if (!inicioFerias || !finalFerias) return;
		const ok = await usuarioService.adicionarFerias(
			usuario.id,
			new Date(inicioFerias),
			new Date(finalFerias),
		);
		if (ok) {
			toast.success('Férias adicionadas');
			setModalFerias(false);
			router.refresh();
		} else {
			toast.error('Erro ao adicionar férias');
		}
	}

	async function adicionarSubstituto() {
		if (!substitutoId) return;
		const ok = await usuarioService.adicionarSubstituto(
			usuario.id,
			substitutoId,
		);
		if (ok) {
			toast.success('Substituto adicionado');
			setModalSubstituto(false);
			router.refresh();
		} else {
			toast.error('Erro ao adicionar substituto');
		}
	}

	async function removerSubstituto(id: string) {
		const ok = await usuarioService.removerSubstituto(id);
		if (ok) {
			toast.success('Substituto removido');
			router.refresh();
		} else {
			toast.error('Erro ao remover substituto');
		}
	}

	return (
		<>
			<div className='flex items-center gap-4 mb-6'>
				<Button
					asChild
					variant='ghost'
					size='icon'>
					<Link href='/usuarios'>
						<ArrowLeft className='size-5' />
					</Link>
				</Button>
				<div>
					<h1 className='text-xl md:text-4xl font-bold'>{usuario.nome}</h1>
					<Badge className='mt-1'>
						{permissoesLabel[permissao] ?? permissao}
					</Badge>
				</div>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Dados do usuário</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label className='text-muted-foreground'>Login</Label>
							<p>{usuario.login}</p>
						</div>
						<div>
							<Label className='text-muted-foreground'>E-mail</Label>
							<p>{usuario.email}</p>
						</div>
						<div>
							<Label>Permissão</Label>
							<Select
								value={permissao}
								onValueChange={setPermissao}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='DEV'>Desenvolvedor</SelectItem>
									<SelectItem value='TEC'>Técnico</SelectItem>
									<SelectItem value='ADM'>Administrador</SelectItem>
									<SelectItem value='USR'>Usuário</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Cargo</Label>
							<Select
								value={cargo}
								onValueChange={setCargo}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='ADM'>Administrativo</SelectItem>
									<SelectItem value='TEC'>Técnico</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Unidade</Label>
							<Select
								value={unidadeId}
								onValueChange={setUnidadeId}>
								<SelectTrigger>
									<SelectValue placeholder='Selecione a unidade' />
								</SelectTrigger>
								<SelectContent>
									{unidades.map((u) => (
										<SelectItem
											key={u.id}
											value={u.id}>
											{u.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button
							onClick={salvarDados}
							disabled={isPending}>
							{isPending && <Loader2 className='size-4 animate-spin mr-2' />}
							Salvar alterações
						</Button>
					</CardContent>
				</Card>

				<div className='space-y-6'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle>Férias</CardTitle>
							<Dialog
								open={modalFerias}
								onOpenChange={setModalFerias}>
								<DialogTrigger asChild>
									<Button
										size='sm'
										variant='outline'>
										<Plus className='size-4 mr-1' />
										Adicionar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Adicionar férias</DialogTitle>
									</DialogHeader>
									<div className='space-y-4'>
										<div>
											<Label>Início</Label>
											<Input
												type='date'
												value={inicioFerias}
												onChange={(e) => setInicioFerias(e.target.value)}
											/>
										</div>
										<div>
											<Label>Final</Label>
											<Input
												type='date'
												value={finalFerias}
												onChange={(e) => setFinalFerias(e.target.value)}
											/>
										</div>
										<Button
											className='w-full'
											onClick={adicionarFerias}>
											Confirmar
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</CardHeader>
						<CardContent>
							{usuario.ferias && usuario.ferias.length > 0 ? (
								<Table roundednone='false'>
									<TableHeader>
										<TableRow>
											<TableHead>Início</TableHead>
											<TableHead>Final</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{usuario.ferias.map((f) => (
											<TableRow key={f.id}>
												<TableCell>
													{format(new Date(f.inicio), 'dd/MM/yyyy')}
												</TableCell>
												<TableCell>
													{format(new Date(f.final), 'dd/MM/yyyy')}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className='text-sm text-muted-foreground'>
									Nenhuma férias cadastrada
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle>Substitutos</CardTitle>
							<Dialog
								open={modalSubstituto}
								onOpenChange={setModalSubstituto}>
								<DialogTrigger asChild>
									<Button
										size='sm'
										variant='outline'>
										<Plus className='size-4 mr-1' />
										Adicionar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Adicionar substituto</DialogTitle>
									</DialogHeader>
									<div className='space-y-4'>
										<Select
											value={substitutoId}
											onValueChange={setSubstitutoId}>
											<SelectTrigger>
												<SelectValue placeholder='Selecione' />
											</SelectTrigger>
											<SelectContent>
												{administrativos
													.filter((a) => a.id !== usuario.id)
													.map((a) => (
														<SelectItem
															key={a.id}
															value={a.id}>
															{a.nome}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<Button
											className='w-full'
											onClick={adicionarSubstituto}>
											Confirmar
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</CardHeader>
						<CardContent>
							{usuario.substitutos && usuario.substitutos.length > 0 ? (
								<ul className='space-y-2'>
									{usuario.substitutos.map((s) => (
										<li
											key={s.id}
											className='flex items-center justify-between border rounded-md px-3 py-2'>
											<span>{s.substituto?.nome ?? '—'}</span>
											<Button
												size='icon'
												variant='ghost'
												onClick={() => removerSubstituto(s.id)}>
												<Trash2 className='size-4 text-destructive' />
											</Button>
										</li>
									))}
								</ul>
							) : (
								<p className='text-sm text-muted-foreground'>
									Nenhum substituto cadastrado
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
