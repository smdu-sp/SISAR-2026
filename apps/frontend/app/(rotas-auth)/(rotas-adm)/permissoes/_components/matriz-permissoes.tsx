/** @format */

'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { definirPerfil, restaurarPadrao } from '@/services/permissoes';
import { IMatrizPermissoes } from '@/types/permissoes';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

const ROTULO_PERFIL: Record<string, string> = {
	DEV: 'Desenvolvedor',
	SUP: 'Supervisor',
	ADM: 'Administrador',
	USR: 'Usuário',
	GAB_ASC: 'Gabinete / ASCOM',
};

function mesmaLista(a: string[], b: string[]) {
	return a.length === b.length && a.every((x) => b.includes(x));
}

export default function MatrizPermissoes({ inicial }: { inicial: IMatrizPermissoes }) {
	const router = useRouter();
	const [salva, setSalva] = useState(inicial.matriz);
	const [rascunho, setRascunho] = useState(inicial.matriz);
	const [confirmaRestaurar, setConfirmaRestaurar] = useState(false);
	const [isPending, startTransition] = useTransition();

	const grupos = useMemo(() => {
		const mapa = new Map<string, typeof inicial.recursos>();
		for (const recurso of inicial.recursos) {
			if (!mapa.has(recurso.grupo)) mapa.set(recurso.grupo, []);
			mapa.get(recurso.grupo)!.push(recurso);
		}
		return [...mapa.entries()];
	}, [inicial]);

	const perfisAlterados = inicial.perfis.filter(
		(p) => !mesmaLista(salva[p] ?? [], rascunho[p] ?? []),
	);
	const alterado = perfisAlterados.length > 0;

	function alternar(perfil: string, chave: string, marcado: boolean) {
		setRascunho((atual) => {
			const lista = new Set(atual[perfil] ?? []);
			if (marcado) lista.add(chave);
			else lista.delete(chave);
			return { ...atual, [perfil]: [...lista] };
		});
	}

	function salvar() {
		startTransition(async () => {
			let ultima = salva;
			for (const perfil of perfisAlterados) {
				const resposta = await definirPerfil(perfil, rascunho[perfil] ?? []);
				if (!resposta.ok || !resposta.data) {
					toast.error(resposta.error ?? `Erro ao salvar o perfil ${perfil}.`);
					setSalva(ultima);
					return;
				}
				ultima = resposta.data.matriz;
			}
			setSalva(ultima);
			setRascunho(ultima);
			toast.success('Permissões salvas. A alteração vale em até 30 segundos.');
			router.refresh();
		});
	}

	function restaurar() {
		startTransition(async () => {
			const resposta = await restaurarPadrao();
			setConfirmaRestaurar(false);
			if (!resposta.ok || !resposta.data) {
				toast.error(resposta.error ?? 'Erro ao restaurar o padrão.');
				return;
			}
			setSalva(resposta.data.matriz);
			setRascunho(resposta.data.matriz);
			toast.success('Permissões restauradas para o padrão.');
			router.refresh();
		});
	}

	return (
		<div className='space-y-4'>
			<Card>
				<CardContent className='p-0 overflow-x-auto'>
					<Table roundednone='false'>
						<TableHeader>
							<TableRow>
								<TableHead className='min-w-[260px]'>Recurso</TableHead>
								{inicial.perfis.map((perfil) => (
									<TableHead
										key={perfil}
										className='text-center min-w-[110px]'>
										{ROTULO_PERFIL[perfil] ?? perfil}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{grupos.map(([grupo, recursos]) => (
								<Fragment key={grupo}>
									<TableRow className='bg-muted/50 hover:bg-muted/50'>
										<TableCell
											colSpan={inicial.perfis.length + 1}
											className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
											{grupo}
										</TableCell>
									</TableRow>
									{recursos.map((recurso) => {
										const travado = recurso.chave === inicial.travado;
										return (
											<TableRow key={recurso.chave}>
												<TableCell>
													<div className='font-medium text-sm'>{recurso.rotulo}</div>
													<div className='text-xs text-muted-foreground'>
														{recurso.descricao}
													</div>
												</TableCell>
												{inicial.perfis.map((perfil) => {
													const marcado = travado
														? perfil === 'DEV'
														: (rascunho[perfil] ?? []).includes(recurso.chave);
													return (
														<TableCell
															key={perfil}
															className='text-center'>
															<Checkbox
																checked={marcado}
																disabled={travado || isPending}
																aria-label={`${recurso.rotulo} — ${ROTULO_PERFIL[perfil] ?? perfil}`}
																onCheckedChange={(valor) =>
																	alternar(perfil, recurso.chave, valor === true)
																}
															/>
														</TableCell>
													);
												})}
											</TableRow>
										);
									})}
								</Fragment>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className='flex flex-wrap items-center justify-between gap-3'>
				<p className='text-xs text-muted-foreground flex items-center gap-1.5'>
					<ShieldCheck size={14} />
					A gestão de permissões é exclusiva do perfil Desenvolvedor e não pode ser alterada.
				</p>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						disabled={isPending}
						onClick={() => setConfirmaRestaurar(true)}>
						Restaurar padrão
					</Button>
					<Button
						variant='outline'
						disabled={!alterado || isPending}
						onClick={() => setRascunho(salva)}>
						Descartar
					</Button>
					<Button
						disabled={!alterado || isPending}
						onClick={salvar}>
						{isPending && <Loader2 className='animate-spin' />}
						Salvar alterações
					</Button>
				</div>
			</div>

			<AlertDialog
				open={confirmaRestaurar}
				onOpenChange={setConfirmaRestaurar}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Restaurar permissões padrão?</AlertDialogTitle>
						<AlertDialogDescription>
							Todas as permissões de todos os perfis voltam ao padrão do sistema. As alterações
							feitas até agora serão perdidas.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={(e) => {
								e.preventDefault();
								restaurar();
							}}>
							Restaurar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
