/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { IListaARProgressaoMensal, IRelatorioFiltrosState } from '@/types/relatorios';
import { TabelaProgressaoARProtocoladas } from './_components/tabelas/tabelaArProtocoladas';
import { verificaData, tipos_relatorios, tipos_extensao_arquivo } from '@/lib/utils';
import { Filtros, TiposFiltros } from '@/components/filtros';
import TabelaDianmica from './_components/tabelaDinamica';

interface IRelatorisPage {
	tipoRelatorio: string,
	extensaoArquivo: string,
	periodoString: string,
	dataInicial: string,
	dataFinal: string,
	anoInicial: string,
	anoFinal: string,
}


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

	const [lista, setLista] = useState([])

	const searchParams = useSearchParams();
	const { data: session, status } = useSession();
	const accessToken = session?.access_token;


	useEffect(() => {
		const tipoRelatorioParam = searchParams.get('tipo_relatorio');
		const extensaoArquivoParam = searchParams.get('extensao_arquivo');
		const periodoParam = searchParams.get('periodo');

		let dataInicioObj: Date | string | null = null;
		let dataFimObj: Date | string | null = null;

		if (periodoParam) {
			const datasArray = periodoParam.split(',');
			console.log("datasArray", datasArray);
			if (datasArray.length === 2 && datasArray[0] && datasArray[1]) {
				[dataInicioObj, dataFimObj] = verificaData(datasArray[0], datasArray[1]);
			}
		}

		setFiltrosAtuais({
			tipoRelatorio: tipoRelatorioParam,
			extensaoArquivo: extensaoArquivoParam,
			periodoString: periodoParam,
			anoInicial: dataInicioObj ? format(dataInicioObj, 'yyyy') : dataInicioObj,
			anoFinal: dataFimObj ? format(dataFimObj, 'yyyy') : dataFimObj,
			dataInicial: dataInicioObj ? format(dataInicioObj, 'dd-MM-yyyy').split(" ")[0] : dataInicioObj,
			dataFinal: dataFimObj ? format(dataFimObj, 'dd-MM-yyyy') : dataFimObj,
		});

	}, [searchParams]);




	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold'>Relatórios</h1>
			<div className='grid grid-cols-1 max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full '>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Tipo de relatório',
							tag: 'tipo_relatorio',
							tipo: TiposFiltros.SELECT,
							valores: tipos_relatorios,
						},
						{
							nome: 'Extensão de arquivo',
							tag: 'extensao_arquivo',
							tipo: TiposFiltros.SELECT,
							valores: tipos_extensao_arquivo,
						},
						{
							nome: 'Período',
							tag: 'periodo',
							tipo: TiposFiltros.DATA,
						},
					]}
				/>
				<div className={`grid grid-cols-1 ${filtrosAtuais.tipoRelatorio === 'ar-progressao-mensal' ? 'md:grid-cols-2' : ''} max-w-sm mx-auto md:max-w-full gap-y-3 my-5 w-full justify-around`}>
					<TabelaDianmica
						tipoRelatorio={filtrosAtuais.tipoRelatorio}
						extensaoArquivo={filtrosAtuais.extensaoArquivo}
						periodoString={filtrosAtuais.periodoString as string}
						anoInicial={filtrosAtuais.anoInicial}
						anoFinal={filtrosAtuais.anoFinal}
						dataInicial={filtrosAtuais.dataInicial}
						dataFinal={filtrosAtuais.dataFinal}
						access_token={accessToken as string}
					/>
				</div>
			</div>
		</div>
	);
}
