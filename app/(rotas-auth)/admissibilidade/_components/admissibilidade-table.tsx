/** @format */

'use client';

import DataTable from '@/components/data-table';
import { IAdmissibilidade } from '@/types/admissibilidade';
import { useCallback, useMemo, useState } from 'react';
import { createColumns } from './columns';
import ModalInadmitir from './modal-inadmitir';

interface AdmissibilidadeTableProps {
	dados: IAdmissibilidade[];
}

export default function AdmissibilidadeTable({ dados }: AdmissibilidadeTableProps) {
	const [modalAberto, setModalAberto] = useState(false);
	const [processoSelecionado, setProcessoSelecionado] = useState<{
		inicialId: number;
		sei: string;
	} | null>(null);

	const abrirInadmitir = useCallback((inicialId: number, sei: string) => {
		setProcessoSelecionado({ inicialId, sei });
		setModalAberto(true);
	}, []);

	const columns = useMemo(
		() => createColumns(abrirInadmitir),
		[abrirInadmitir],
	);

	return (
		<>
			<DataTable columns={columns} data={dados} />
			{processoSelecionado && (
				<ModalInadmitir
					open={modalAberto}
					onOpenChange={setModalAberto}
					inicialId={processoSelecionado.inicialId}
					sei={processoSelecionado.sei}
				/>
			)}
		</>
	);
}
