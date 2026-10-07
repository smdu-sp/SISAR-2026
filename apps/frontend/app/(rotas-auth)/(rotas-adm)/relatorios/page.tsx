/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { IRelatorioFiltrosState } from '@/types/relatorios';
import { verificaData, tipos_relatorios, pageContainer } from '@/lib/utils';
import { Filtros, TiposFiltros } from '@/components/filtros';
import TabelaDianmica from './_components/tabelaDinamica';
import { BotoesExportacao } from './_components/botoesExportacao';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Download, FileSearch, SlidersHorizontal } from 'lucide-react';


export default function RelatoriosPage() {
	const [filtrosAtuais, setFiltrosAtuais] = useState<IRelatorioFiltrosState>({
		tipoRelatorio: '',
		extensaoArquivo: '',
		periodoString: '',
		dataInicial: '',
		dataFinal: '',
		anoInicial: '',
		anoFinal: '',
	});

	const searchParams = useSearchParams();
	const { data: session } = useSession();
	const accessToken = session?.access_token;


	useEffect(() => {
		const tipoRelatorioParam = searchParams.get('tipo_relatorio');
		const periodoParam = searchParams.get('periodo');

		let dataInicioObj: Date | string | null = null;
		let dataFimObj: Date | string | null = null;

		if (periodoParam) {
			const datasArray = periodoParam.split(',');
			if (datasArray.length === 2 && datasArray[0] && datasArray[1]) {
				[dataInicioObj, dataFimObj] = verificaData(datasArray[0], datasArray[1]);
			}
		}

		setFiltrosAtuais({
			tipoRelatorio: tipoRelatorioParam,
			extensaoArquivo: null,
			periodoString: periodoParam,
			anoInicial: dataInicioObj ? format(dataInicioObj, 'yyyy') : dataInicioObj,
			anoFinal: dataFimObj ? format(dataFimObj, 'yyyy') : dataFimObj,
			dataInicial: dataInicioObj ? format(dataInicioObj, 'dd-MM-yyyy').split(" ")[0] : dataInicioObj,
			dataFinal: dataFimObj ? format(dataFimObj, 'dd-MM-yyyy') : dataFimObj,
		});

	}, [searchParams]);




	const relatorioSelecionado = tipos_relatorios.find((t) => t.value === filtrosAtuais.tipoRelatorio);
	const semPeriodo =
		Boolean(filtrosAtuais.tipoRelatorio) &&
		filtrosAtuais.tipoRelatorio !== 'ar-gabinete-prefeito' &&
		!filtrosAtuais.periodoString;
	const podeMostrar = Boolean(filtrosAtuais.tipoRelatorio) && !semPeriodo;

	return (
		<div className={pageContainer}>
			<PageHeader subtitle='Consulte os indicadores e exporte os relatórios em Excel ou PDF' />

			<div className='grid gap-5 lg:grid-cols-[1fr_auto]'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-base'>
							<SlidersHorizontal size={18} />
							Filtros
						</CardTitle>
						<CardDescription>Escolha o relatório e o período que deseja consultar.</CardDescription>
					</CardHeader>
					<CardContent>
						<Filtros
							camposFiltraveis={[
								{
									nome: 'Tipo de relatório',
									tag: 'tipo_relatorio',
									tipo: TiposFiltros.SELECT,
									valores: tipos_relatorios,
								},
								{
									nome: 'Período',
									tag: 'periodo',
									tipo: TiposFiltros.DATA,
								},
							]}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-base'>
							<Download size={18} />
							Exportação
						</CardTitle>
						<CardDescription>
							{podeMostrar
								? 'Baixe o relatório exibido abaixo.'
								: 'Disponível após selecionar o relatório.'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BotoesExportacao
							tipoRelatorio={filtrosAtuais.tipoRelatorio}
							periodoString={filtrosAtuais.periodoString}
							anoInicial={filtrosAtuais.anoInicial}
							anoFinal={filtrosAtuais.anoFinal}
							dataInicial={filtrosAtuais.dataInicial}
							dataFinal={filtrosAtuais.dataFinal}
							accessToken={accessToken}
						/>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-base'>
						<BarChart3 size={18} />
						{relatorioSelecionado?.label ?? 'Relatório'}
					</CardTitle>
					{podeMostrar && filtrosAtuais.periodoString && (
						<CardDescription>Período selecionado: {filtrosAtuais.periodoString.replace(',', ' a ')}</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					{podeMostrar ? (
						<div className='overflow-x-auto'>
							<TabelaDianmica
								tipoRelatorio={filtrosAtuais.tipoRelatorio}
								extensaoArquivo={null}
								periodoString={filtrosAtuais.periodoString as string}
								anoInicial={filtrosAtuais.anoInicial}
								anoFinal={filtrosAtuais.anoFinal}
								dataInicial={filtrosAtuais.dataInicial}
								dataFinal={filtrosAtuais.dataFinal}
								access_token={accessToken as string}
							/>
						</div>
					) : (
						<div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
							<div className='rounded-full bg-primary/10 p-4 text-primary'>
								<FileSearch size={32} strokeWidth={1.6} />
							</div>
							<div className='space-y-1'>
								<p className='text-base font-semibold'>
									{semPeriodo ? 'Selecione o período' : 'Nenhum relatório selecionado'}
								</p>
								<p className='mx-auto max-w-md text-sm text-muted-foreground'>
									{semPeriodo
										? 'Falta escolher o período para gerar este relatório. Use o filtro "Período" acima.'
										: 'Escolha o tipo de relatório e o período nos filtros acima para visualizar os dados aqui e liberar a exportação.'}
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
