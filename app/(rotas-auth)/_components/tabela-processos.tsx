/** @format */

'use client';

import DataTable from '@/components/data-table';
import { classeLinhaProcesso } from '@/lib/listagem-processo';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';

interface TabelaProcessosProps {
	columns: ColumnDef<IProcesso>[];
	data: IProcesso[];
}

export default function TabelaProcessos({ columns, data }: TabelaProcessosProps) {
	return (
		<DataTable
			columns={columns}
			data={data}
			getRowClassName={classeLinhaProcesso}
		/>
	);
}
