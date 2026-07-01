/** @format */

'use client';

import DataTable from '@/components/data-table';
import { ICoordenadoriaSelect } from '@/types/coordenadorias';
import { IDiretoria } from '@/types/diretorias';
import { getDiretoriaColumns } from './columns';

interface DiretoriasDataTableProps {
	dados: IDiretoria[];
	coordenadorias: ICoordenadoriaSelect[];
}

export function DiretoriasDataTable({
	dados,
	coordenadorias,
}: DiretoriasDataTableProps) {
	return (
		<DataTable
			columns={getDiretoriaColumns(coordenadorias)}
			data={dados}
		/>
	);
}
