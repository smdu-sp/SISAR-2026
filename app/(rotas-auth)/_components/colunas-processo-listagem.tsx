/** @format */

'use client';

import {
	classeTextoDiasPrazo,
	resumoPrazoListagem,
	rotuloProcessoListagem,
	textoCelulaDiasPrazo,
} from '@/lib/listagem-processo';
import { urlProcesso } from '@/lib/processo-navegacao';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

function formatarData(valor?: string | Date | null) {
	if (!valor) return '-';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '-';
	return data.toLocaleDateString('pt-BR');
}

export function colunaIdentificadorProcesso(): ColumnDef<IProcesso> {
	return {
		id: 'processo',
		header: 'Processo',
		cell: ({ row }) => (
			<Link
				href={urlProcesso(row.original.id, row.original.status ?? undefined)}
				className='font-medium text-primary hover:underline'>
				{rotuloProcessoListagem(row.original)}
			</Link>
		),
	};
}

export function colunaDataProtocolo(): ColumnDef<IProcesso> {
	return {
		accessorKey: 'data_protocolo',
		header: 'Protocolo',
		cell: ({ row }) => formatarData(row.original.data_protocolo),
	};
}

export function colunaTipoAlvara(): ColumnDef<IProcesso> {
	return {
		id: 'alvara_tipo',
		header: 'Tipo de Alvará',
		cell: ({ row }) => row.original.alvara_tipo?.nome ?? '-',
	};
}

export function colunaDiasPrazoEtapa(): ColumnDef<IProcesso> {
	return {
		id: 'dias_prazo',
		header: () => (
			<span title='Dias restantes do prazo na etapa atual'>
				Dias rest.
			</span>
		),
		cell: ({ row }) => {
			const { info } = resumoPrazoListagem(row.original);
			const texto = textoCelulaDiasPrazo(info);
			const dias = info.diasRestantes;

			return (
				<span
					className={classeTextoDiasPrazo(dias)}
					title={[info.titulo, info.mensagem, info.detalhe]
						.filter(Boolean)
						.join(' — ')}>
					{texto}
				</span>
			);
		},
	};
}
