'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TriangleAlert, CalendarClock, Timer, CheckCircle2, Flag, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn, pageContainer } from '@/lib/utils';
import type { FasePrazoProcesso } from '@/lib/prazo-fase';
import { DeadlineRing, SitPill, STATUS_COLOR, type SituacaoPrazo } from './deadline-ring';
import { PageHeader } from '@/components/page-header';

export type { SituacaoPrazo };
type TabPainel = SituacaoPrazo | 'todos';
type PorPaginaPainel = 10 | 50 | 100 | 'todos';

export interface ProcessoPainel {
	id: number;
	rotulo: string;
	requerimento: string | null;
	status: number | null;
	alvaraNome: string | null;
	situacao: SituacaoPrazo;
	diasRestantes: number | null;
	fase: FasePrazoProcesso;
	faseGrupo: string;
	tecnico: string | null;
}

interface Props {
	processos: ProcessoPainel[];
	counts: { vencido: number; hoje: number; avencer: number; noprazo: number; finalizado: number };
	ativos: number;
	criticos: number;
	porFase: { nome: string; n: number }[];
	maxFase: number;
}

const STATUS_LABELS: Record<number, string> = {
	0: 'Admissibilidade',
	1: 'Em análise',
	2: 'Em análise',
	3: 'Deferido',
	4: 'Indeferido',
};

/* ── KPI card ────────────────────────────────────────────── */
function KpiCard({
	label,
	count,
	color,
	icon,
	selected,
	onClick,
}: {
	label: string;
	count: number;
	color: string;
	icon: React.ReactNode;
	selected?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'bg-card rounded-xl text-left transition-all cursor-pointer overflow-hidden w-full',
				selected ? 'shadow-md' : 'shadow-sm hover:shadow-md',
			)}
			style={{
				outline: selected ? `2px solid ${color}` : '1px solid var(--border)',
				outlineOffset: selected ? 2 : 0,
			}}
		>
			<div className='h-1' style={{ background: color }} />
			<div className='p-4'>
				<div className='mb-3'>
					<div
						className='inline-flex rounded-lg p-2'
						style={{
							background: `color-mix(in srgb, ${color} 12%, transparent)`,
							color,
						}}
					>
						{icon}
					</div>
				</div>
				<div className='text-3xl font-bold mono tabular-nums mb-0.5'>{count}</div>
				<div className='text-xs font-semibold text-muted-foreground'>{label}</div>
			</div>
		</button>
	);
}

/* ── Process table ───────────────────────────────────────── */
function ProcTable({ rows }: { rows: ProcessoPainel[] }) {
	if (rows.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-16 text-muted-foreground gap-3'>
				<Inbox size={40} strokeWidth={1.4} />
				<p className='text-sm font-medium'>Nenhum processo nesta situação.</p>
			</div>
		);
	}

	return (
		<div className='overflow-x-auto'>
			<table className='w-full text-sm'>
				<thead>
					<tr className='border-b border-border/60'>
						<th
							className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
							style={{ width: 72 }}
						>
							Prazo
						</th>
						<th className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'>
							SEI / Requerente
						</th>
						<th className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide hidden md:table-cell'>
							Status
						</th>
						<th className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide hidden lg:table-cell'>
							Tipo
						</th>
						<th className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide hidden lg:table-cell'>
							Fase
						</th>
						<th className='text-left py-3 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'>
							Situação
						</th>
						<th className='py-3 px-2' />
					</tr>
				</thead>
				<tbody>
					{rows.map((p) => (
						<tr
							key={p.id}
							className='border-b border-border/30 last:border-0 hover:bg-accent/50 transition-colors'
						>
							<td className='py-3 px-4'>
								<DeadlineRing situacao={p.situacao} dias={p.diasRestantes} size={48} stroke={5} />
							</td>
							<td className='py-3 px-4'>
								<div className='space-y-0.5'>
									<div className='font-semibold mono text-[13px]'>{p.rotulo}</div>
									{p.requerimento && (
										<div className='text-xs text-muted-foreground font-medium truncate max-w-[220px]'>
											{p.requerimento}
										</div>
									)}
								</div>
							</td>
							<td className='py-3 px-4 hidden md:table-cell'>
								<span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground'>
									{STATUS_LABELS[p.status ?? 0] ?? '—'}
								</span>
							</td>
							<td className='py-3 px-4 hidden lg:table-cell'>
								<span className='text-xs text-foreground/80 font-medium'>
									{p.alvaraNome ?? '—'}
								</span>
							</td>
							<td className='py-3 px-4 hidden lg:table-cell'>
								<span className='text-xs font-semibold'>{p.faseGrupo}</span>
							</td>
							<td className='py-3 px-4'>
								<SitPill situacao={p.situacao} small />
							</td>
							<td className='py-3 px-2 text-right'>
								<Link
									href={`/processos/${p.id}`}
									className='inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'
								>
									<ChevronRight size={16} />
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* ── Attention ring (specialized for criticos count) ────── */
function AttentionRing({ criticos }: { criticos: number }) {
	const size = 96, stroke = 9;
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;
	const color = criticos > 0 ? 'var(--status-vencido)' : 'var(--status-noprazo)';
	const frac = criticos > 0 ? 1 : 0.05;
	const dash = circ * frac;

	return (
		<div className='relative inline-flex items-center justify-center' style={{ width: size, height: size }}>
			<svg
				width={size}
				height={size}
				style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
			>
				<circle
					cx={size / 2} cy={size / 2} r={r}
					fill='none' stroke='var(--border)' strokeWidth={stroke}
				/>
				<circle
					cx={size / 2} cy={size / 2} r={r}
					fill='none' stroke={color} strokeWidth={stroke}
					strokeLinecap='round' strokeDasharray={`${dash} ${circ}`}
					style={{ transition: 'stroke-dasharray 0.5s ease' }}
				/>
			</svg>
			<div className='relative z-10 flex flex-col items-center justify-center leading-none select-none' style={{ gap: 1 }}>
				<span className='font-mono font-bold' style={{ fontSize: 26, color, lineHeight: 1 }}>
					{criticos > 0 ? criticos : '✓'}
				</span>
				{criticos > 0 && (
					<span style={{ fontSize: 10, color, fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1 }}>
						CRÍTICOS
					</span>
				)}
			</div>
		</div>
	);
}

/* ── Main export ─────────────────────────────────────────── */
export default function PainelClient({
	processos,
	counts,
	ativos,
	criticos,
	porFase,
	maxFase,
}: Props) {
	const [aba, setAba] = useState<TabPainel>('vencido');
	const [porPagina, setPorPagina] = useState<PorPaginaPainel>(10);
	const [pagina, setPagina] = useState(1);

	const ativosList = processos.filter((p) => p.situacao !== 'finalizado');
	const rows = aba === 'todos' ? ativosList : processos.filter((p) => p.situacao === aba);

	const quantidadePorPagina = porPagina === 'todos' ? Math.max(rows.length, 1) : porPagina;
	const totalPaginas = Math.max(1, Math.ceil(rows.length / quantidadePorPagina));
	const paginaAtual = Math.min(pagina, totalPaginas);
	const inicio = (paginaAtual - 1) * quantidadePorPagina;
	const fim = Math.min(inicio + quantidadePorPagina, rows.length);
	const rowsPagina = rows.slice(inicio, fim);

	// Volta para a primeira página ao trocar de aba ou de tamanho de página.
	useEffect(() => {
		setPagina(1);
	}, [aba, porPagina]);

	const kpis = [
		{ key: 'vencido' as TabPainel, label: 'Vencidos', color: STATUS_COLOR.vencido, icon: <TriangleAlert size={16} />, n: counts.vencido },
		{ key: 'hoje' as TabPainel, label: 'Vence hoje', color: STATUS_COLOR.hoje, icon: <CalendarClock size={16} />, n: counts.hoje },
		{ key: 'avencer' as TabPainel, label: 'A vencer (≤3d)', color: STATUS_COLOR.avencer, icon: <Timer size={16} />, n: counts.avencer },
		{ key: 'noprazo' as TabPainel, label: 'No prazo', color: STATUS_COLOR.noprazo, icon: <CheckCircle2 size={16} />, n: counts.noprazo },
		{ key: 'finalizado' as TabPainel, label: 'Finalizados', color: STATUS_COLOR.finalizado, icon: <Flag size={16} />, n: counts.finalizado },
	];

	const abas: { key: TabPainel; label: string; n: number }[] = [
		{ key: 'vencido', label: 'Vencidos', n: counts.vencido },
		{ key: 'hoje', label: 'Vence hoje', n: counts.hoje },
		{ key: 'avencer', label: 'A vencer', n: counts.avencer },
		{ key: 'noprazo', label: 'No prazo', n: counts.noprazo },
		{ key: 'todos', label: 'Todos ativos', n: ativos },
	];

	return (
		<div className={pageContainer}>
			<PageHeader
				title='Painel de Prazos'
				subtitle='Visão geral dos processos e situação de prazos'
			/>

			{/* KPI row */}
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
				{kpis.map((k) => (
					<KpiCard
						key={k.key}
						label={k.label}
						count={k.n}
						color={k.color}
						icon={k.icon}
						selected={aba === k.key}
						onClick={() => setAba(k.key)}
					/>
				))}
			</div>

			{/* Carga por fase + Atenção imediata */}
			<div className='grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4'>
				<div className='bg-card rounded-xl p-5 shadow-sm border border-border/40'>
					<div className='flex items-center justify-between mb-5'>
						<h2 className='text-sm font-extrabold'>Carga por fase</h2>
						<span className='text-xs text-muted-foreground font-medium'>{ativos} ativos</span>
					</div>
					<div className='space-y-4'>
						{porFase.map(({ nome, n }) => (
							<div key={nome}>
								<div className='flex items-center justify-between mb-1.5'>
									<span className='text-sm font-bold'>{nome}</span>
									<span className='mono text-sm font-semibold text-muted-foreground'>{n}</span>
								</div>
								<div className='h-2 rounded-full bg-border overflow-hidden'>
									<div
										className='h-full rounded-full transition-all duration-500'
										style={{
											width: `${maxFase > 0 ? (n / maxFase) * 100 : 0}%`,
											background: 'var(--primary)',
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='bg-card rounded-xl p-5 shadow-sm border border-border/40 flex flex-col items-center justify-center text-center'>
					<AttentionRing criticos={criticos} />
					<div className='font-extrabold text-[15px] mt-4 whitespace-nowrap'>Atenção imediata</div>
					<p className='text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[180px]'>
						{criticos === 0
							? 'Nenhum processo vencido ou vencendo hoje.'
							: `${criticos} processo${criticos !== 1 ? 's' : ''} vencido${criticos !== 1 ? 's' : ''} ou vencendo hoje ${criticos !== 1 ? 'precisam' : 'precisa'} de ação.`}
					</p>
				</div>
			</div>

			{/* Process table */}
			<div className='bg-card rounded-xl shadow-sm border border-border/40 overflow-hidden'>
				<div className='px-5 pt-5 pb-4 border-b border-border/50'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
						<h2 className='text-[15px] font-extrabold'>Processos por situação de prazo</h2>
						<div className='flex flex-wrap gap-1.5'>
							{abas.map((a) => (
								<button
									key={a.key}
									onClick={() => setAba(a.key)}
									className={cn(
										'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5',
										aba === a.key
											? 'bg-primary text-primary-foreground'
											: 'bg-accent text-accent-foreground hover:bg-muted',
									)}
								>
									{a.label}
									<span
										className={cn(
											'inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold leading-none',
											aba === a.key
												? 'bg-white/20 text-primary-foreground'
												: 'bg-muted text-muted-foreground',
										)}
									>
										{a.n}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
				<ProcTable rows={rowsPagina} />
				{rows.length > 0 && (
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-border/50'>
						<div className='flex items-center gap-2 text-xs text-muted-foreground'>
							<span className='font-medium'>Por página:</span>
							{([10, 50, 100, 'todos'] as const).map((n) => (
								<button
									key={n}
									onClick={() => setPorPagina(n)}
									className={cn(
										'px-2.5 py-1 rounded-md font-semibold transition-all',
										porPagina === n
											? 'bg-primary text-primary-foreground'
											: 'bg-accent text-accent-foreground hover:bg-muted',
									)}
								>
									{n === 'todos' ? 'Todos' : n}
								</button>
							))}
						</div>
						<div className='flex items-center gap-3 text-xs'>
							<span className='text-muted-foreground font-medium'>
								{inicio + 1}–{fim} de {rows.length}
							</span>
							<div className='flex gap-1'>
								<button
									onClick={() => setPagina((p) => Math.max(1, p - 1))}
									disabled={paginaAtual <= 1}
									aria-label='Página anterior'
									className='inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent text-accent-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none'
								>
									<ChevronLeft size={16} />
								</button>
								<button
									onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
									disabled={paginaAtual >= totalPaginas}
									aria-label='Próxima página'
									className='inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent text-accent-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none'
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
