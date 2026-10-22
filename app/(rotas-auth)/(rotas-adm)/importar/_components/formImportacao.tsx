/** @format */

'use client';

import { useRef, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
	CheckCircle2,
	Download,
	FileSpreadsheet,
	Loader2,
	Upload,
	X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formataProcesso } from '@/lib/utils';
import { importarPlanilha } from '@/services/processos';
import { IResultadoImportacao } from '@/types/importacao';

export function FormImportacao() {
	const { data: session } = useSession();
	const inputRef = useRef<HTMLInputElement>(null);
	const [arquivo, setArquivo] = useState<File | null>(null);
	const [resultado, setResultado] = useState<IResultadoImportacao | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;
		setResultado(null);
		if (file && !file.name.toLowerCase().endsWith('.xlsx')) {
			toast.error('Formato inválido', {
				description: 'Envie um arquivo no formato .xlsx (use o modelo).',
			});
			setArquivo(null);
			if (inputRef.current) inputRef.current.value = '';
			return;
		}
		setArquivo(file);
	}

	function limparArquivo() {
		setArquivo(null);
		setResultado(null);
		if (inputRef.current) inputRef.current.value = '';
	}

	function handleImportar() {
		const token = session?.access_token;
		if (!token) {
			toast.error('Não autorizado');
			return;
		}
		if (!arquivo) {
			toast.error('Selecione um arquivo .xlsx para importar.');
			return;
		}
		startTransition(async () => {
			const resposta = await importarPlanilha(arquivo, token);
			if (!resposta.ok || !resposta.data) {
				toast.error('Falha na importação', {
					description: resposta.error ?? 'Erro desconhecido.',
				});
				return;
			}
			setResultado(resposta.data);
			const { criados, duplicados, erros } = resposta.data;
			toast.success('Importação concluída', {
				description: `${criados} criado(s), ${duplicados} duplicado(s), ${erros} com erro.`,
			});
		});
	}

	return (
		<div className='grid gap-6 lg:grid-cols-2'>
			{/* Coluna esquerda: instruções + upload */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<FileSpreadsheet className='h-5 w-5 text-primary' />
						Importar processos por planilha
					</CardTitle>
					<CardDescription>
						Baixe o modelo, preencha uma linha por processo e envie o arquivo
						.xlsx. A importação é incremental — SEIs já cadastrados são ignorados.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Button
						asChild
						variant='outline'
						className='w-full sm:w-auto'>
						<a
							href='/modelo-importacao-processos.xlsx'
							download>
							<Download className='mr-2 h-4 w-4' />
							Baixar modelo (.xlsx)
						</a>
					</Button>

					<div className='space-y-2'>
						<label
							htmlFor='file-upload'
							className='text-sm font-medium'>
							Arquivo da planilha
						</label>
						<div
							className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input p-6 text-center transition-colors hover:border-primary/50'
							onClick={() => inputRef.current?.click()}
							role='button'>
							<Upload className='h-6 w-6 text-muted-foreground' />
							<p className='text-sm text-muted-foreground'>
								{arquivo
									? 'Trocar arquivo selecionado'
									: 'Clique para selecionar um arquivo .xlsx'}
							</p>
							<input
								id='file-upload'
								ref={inputRef}
								type='file'
								accept='.xlsx'
								className='hidden'
								onChange={handleFileChange}
							/>
						</div>
						{arquivo && (
							<div className='flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm'>
								<span className='flex items-center gap-2 truncate'>
									<FileSpreadsheet className='h-4 w-4 shrink-0 text-primary' />
									<span className='truncate'>{arquivo.name}</span>
								</span>
								<button
									type='button'
									onClick={limparArquivo}
									className='shrink-0 text-muted-foreground hover:text-destructive'
									aria-label='Remover arquivo'>
									<X className='h-4 w-4' />
								</button>
							</div>
						)}
					</div>

					<Button
						onClick={handleImportar}
						disabled={!arquivo || isPending}
						className='w-full'>
						{isPending ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Importando...
							</>
						) : (
							<>
								<Upload className='mr-2 h-4 w-4' />
								Importar processos
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			{/* Coluna direita: resultado */}
			<Card>
				<CardHeader>
					<CardTitle>Resultado da importação</CardTitle>
					<CardDescription>
						O resumo aparece aqui após o envio da planilha.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!resultado ? (
						<div className='flex h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground'>
							<FileSpreadsheet className='h-8 w-8 opacity-40' />
							<p className='text-sm'>Nenhuma importação realizada ainda.</p>
						</div>
					) : (
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
								<ResumoItem label='Total' valor={resultado.total} />
								<ResumoItem label='Criados' valor={resultado.criados} cor='text-emerald-600' />
								<ResumoItem label='Duplicados' valor={resultado.duplicados} cor='text-amber-600' />
								<ResumoItem label='Erros' valor={resultado.erros} cor='text-destructive' />
							</div>

							{resultado.criados > 0 && resultado.erros === 0 && (
								<div className='flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400'>
									<CheckCircle2 className='h-4 w-4' />
									Importação concluída com sucesso.
								</div>
							)}

							{resultado.detalhes.filter((d) => d.status !== 'criado').length >
								0 && (
								<div className='space-y-2'>
									<p className='text-sm font-medium'>
										Linhas não importadas
									</p>
									<ScrollArea className='h-64 rounded-md border'>
										<ul className='divide-y'>
											{resultado.detalhes
												.filter((d) => d.status !== 'criado')
												.map((d) => (
													<li
														key={`${d.linha}-${d.sei}`}
														className='flex items-start justify-between gap-3 p-3 text-sm'>
														<div className='min-w-0'>
															<p className='font-medium'>
																Linha {d.linha}
																{d.sei && (
																	<span className='ml-1 font-normal text-muted-foreground'>
																		· {formataProcesso(d.sei)}
																	</span>
																)}
															</p>
															{d.mensagem && (
																<p className='text-xs text-muted-foreground'>
																	{d.mensagem}
																</p>
															)}
														</div>
														<Badge
															variant={
																d.status === 'duplicado'
																	? 'secondary'
																	: 'destructive'
															}
															className='shrink-0'>
															{d.status}
														</Badge>
													</li>
												))}
										</ul>
									</ScrollArea>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function ResumoItem({
	label,
	valor,
	cor,
}: {
	label: string;
	valor: number;
	cor?: string;
}) {
	return (
		<div className='rounded-lg border p-3 text-center'>
			<p className={`text-2xl font-bold ${cor ?? ''}`}>{valor}</p>
			<p className='text-xs text-muted-foreground'>{label}</p>
		</div>
	);
}
