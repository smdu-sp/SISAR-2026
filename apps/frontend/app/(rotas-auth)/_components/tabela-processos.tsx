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
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

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

	function limparFiltros() {
		setTipo('todos');
		setSit('todas');
		setBusca('');
		aplicaBusca('');
	}

	function handleBuscaKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') aplicaBusca(busca);
	}

	return (
		<div className='space-y-3'>
			{/* Filtros: mesmo padrão visual do componente Filtros (rótulo + campo + aplicar/limpar) */}
			<div className='flex flex-wrap items-end gap-4 w-full'>
				<div className='flex flex-col w-full md:w-60 text-sm xl:text-base'>
					<p>Busca</p>
					<Input
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
						onKeyDown={handleBuscaKeyDown}
						placeholder='SEI, requerimento ou processo'
						disabled={isPending}
					/>
				</div>
				<div className='flex flex-col w-full md:w-60 text-sm xl:text-base'>
					<p>Tipo</p>
					<Select value={tipo} onValueChange={(v) => setTipo(v as TipoFiltro)}>
						<SelectTrigger className='w-full text-nowrap'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TIPO_OPTS.map((o) => (
								<SelectItem key={o.value} value={o.value} className='text-nowrap'>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex flex-col w-full md:w-60 text-sm xl:text-base'>
					<p>Situação</p>
					<Select value={sit} onValueChange={(v) => setSit(v as SitFiltro)}>
						<SelectTrigger className='w-full text-nowrap'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SIT_OPTS.map((o) => (
								<SelectItem key={o.value} value={o.value} className='text-nowrap'>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='isolate flex -space-x-px basis-full w-full xl:basis-auto xl:w-auto shrink-0'>
					<Button
						className='rounded-r-none flex-1 xl:flex-none'
						disabled={isPending}
						onClick={() => aplicaBusca(busca)}
						title='Aplicar filtros'>
						<RefreshCw className={isPending ? 'animate-spin' : ''} />
					</Button>
					<Button
						variant='destructive'
						disabled={isPending}
						className='rounded-l-none flex-1 xl:flex-none'
						onClick={limparFiltros}
						title='Limpar filtros'>
						<X />
					</Button>
				</div>
				{filtrosAtivos && (
					<span className='text-sm text-muted-foreground ml-auto'>
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
