'use client';

import { Button } from '@/components/ui/button';
import { exportarRelatorio } from '@/services/relatorios/exportar';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface BotoesExportacaoProps {
	tipoRelatorio: string | null;
	periodoString?: string | null;
	dataInicial?: string | Date | null;
	dataFinal?: string | Date | null;
	anoInicial?: string | Date | null;
	anoFinal?: string | Date | null;
	accessToken?: string;
}

export function BotoesExportacao({
	tipoRelatorio,
	periodoString,
	dataInicial,
	dataFinal,
	anoInicial,
	anoFinal,
	accessToken,
}: BotoesExportacaoProps) {
	const [isPending, startTransition] = useTransition();
	const podeExportar =
		Boolean(tipoRelatorio && accessToken) &&
		(tipoRelatorio === 'ar-gabinete-prefeito' || Boolean(periodoString));

	function handleExportar(formato: 'excel' | 'pdf') {
		if (!tipoRelatorio || !accessToken) return;

		startTransition(async () => {
			try {
				await exportarRelatorio({
					tipoRelatorio,
					formato,
					periodo: periodoString,
					dataInicial,
					dataFinal,
					anoInicial,
					anoFinal,
					accessToken,
				});
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: 'Erro ao exportar relatório.',
				);
			}
		});
	}

	return (
		<div className='flex flex-col gap-2 sm:flex-row'>
			<Button
				type='button'
				variant='outline'
				disabled={!podeExportar || isPending}
				onClick={() => handleExportar('excel')}>
				<FileSpreadsheet />
				Exportar como EXCEL
			</Button>
			<Button
				type='button'
				variant='outline'
				disabled={!podeExportar || isPending}
				onClick={() => handleExportar('pdf')}>
				<FileText />
				Exportar como PDF
			</Button>
		</div>
	);
}
