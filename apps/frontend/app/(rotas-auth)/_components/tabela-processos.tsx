/** @format */

'use client';

import { useState, useMemo, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import DataTable from '@/components/data-table';
import {
	calcSituacaoPrazo,
	classeLinhaProcesso,
	type SituacaoPrazo,
} from '@/lib/listagem-processo';
import { IProcesso } from '@/types/processos';
import { ColumnDef } from '@tanstack/react-table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TabelaProcessosProps {
	columns: ColumnDef<IProcesso>[];
	data: IProcesso[];
	children?: React.ReactNode;
}

type TipoFiltro = 'todos' | 'smul' | 'multi';
type SitFiltro = 'todas' | SituacaoPrazo;

const TIPO_OPTS: { value: TipoFiltro; label: string }[] = [
	{ value: 'todos', label: 'Todos os tipos' },
	{ value: 'smul', label: 'Próprio SMUL' },
	{ value: 'multi', label: 'Múltiplas Interfaces' },
];

const SIT_OPTS: { value: SitFiltro; label: string }[] = [
	{ value: 'todas', label: 'Todas as situações' },
	{ value: 'vencido', label: 'Vencidos' },
	{ value: 'hoje', label: 'Vence hoje' },
	{ value: 'avencer', label: 'A vencer (≤3d)' },
	{ value: 'noprazo', label: 'No prazo' },
	{ value: 'finalizado', label: 'Finalizados' },
];

export default function TabelaProcessos({ columns, data, children }: TabelaProcessosProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const [tipo, setTipo] = useState<TipoFiltro>('todos');
	const [sit, setSit] = useState<SitFiltro>('todas');
	const [busca, setBusca] = useState(searchParams.get('busca') ?? '');

	const filtrado = useMemo(() => {
		let r = data;
		if (tipo === 'smul') r = r.filter((p) => (p.tipo_processo ?? 1) !== 2);
		if (tipo === 'multi') r = r.filter((p) => p.tipo_processo === 2);
		if (sit !== 'todas') r = r.filter((p) => calcSituacaoPrazo(p) === sit);
		return r;
	}, [data, tipo, sit]);

	const filtrosAtivos = tipo !== 'todos' || sit !== 'todas';

	const aplicaBusca = useCallback((valor: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (valor.trim()) {
			params.set('busca', valor.trim());
		} else {
			params.delete('busca');
		}
		params.delete('pagina');
		startTransition(() => router.push(`${pathname}?${params.toString()}`));
	}, [searchParams, pathname, router]);

	function handleBuscaKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') aplicaBusca(busca);
	}

	return (
		<div className='space-y-3'>
			{/* Linha 1: busca + selects */}
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative flex-1 min-w-[200px] max-w-sm'>
					<Search size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none' />
					<Input
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
						onKeyDown={handleBuscaKeyDown}
						onBlur={() => aplicaBusca(busca)}
						placeholder='SEI, requerimento ou processo'
						className='pl-8 h-8 text-xs bg-background'
						disabled={isPending}
					/>
				</div>
				<Select value={tipo} onValueChange={(v) => setTipo(v as TipoFiltro)}>
					<SelectTrigger className='w-[170px] h-8 text-xs bg-background'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{TIPO_OPTS.map((o) => (
							<SelectItem key={o.value} value={o.value} className='text-xs'>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={sit} onValueChange={(v) => setSit(v as SitFiltro)}>
					<SelectTrigger className='w-[185px] h-8 text-xs bg-background'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SIT_OPTS.map((o) => (
							<SelectItem key={o.value} value={o.value} className='text-xs'>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{filtrosAtivos && (
					<button
						onClick={() => { setTipo('todos'); setSit('todas'); }}
						className='text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors'
					>
						Limpar
					</button>
				)}
				{filtrosAtivos && (
					<span className='text-xs text-muted-foreground ml-auto'>
						{filtrado.length} de {data.length} na página
					</span>
				)}
			</div>

			{/* Linha 2: abas/filtros clicáveis (ex: FaseTabs) */}
			{children}

			<DataTable
				columns={columns}
				data={filtrado}
				getRowClassName={classeLinhaProcesso}
			/>
		</div>
	);
}
