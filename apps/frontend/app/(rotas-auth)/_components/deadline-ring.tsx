'use client';

import type { SituacaoPrazo } from '@/lib/listagem-processo';

export type { SituacaoPrazo };

export const STATUS_COLOR: Record<SituacaoPrazo, string> = {
	vencido: 'var(--status-vencido)',
	hoje: 'var(--status-hoje)',
	avencer: 'var(--status-avencer)',
	noprazo: 'var(--status-noprazo)',
	finalizado: 'var(--status-finalizado)',
};

const SIT_LABELS: Record<SituacaoPrazo, string> = {
	vencido: 'Vencido',
	hoje: 'Vence hoje',
	avencer: 'A vencer',
	noprazo: 'No prazo',
	finalizado: 'Finalizado',
};

export function DeadlineRing({
	situacao,
	dias,
	size = 48,
	stroke = 5,
}: {
	situacao: SituacaoPrazo;
	dias: number | null;
	size?: number;
	stroke?: number;
}) {
	const color = STATUS_COLOR[situacao];
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;

	let frac: number;
	if (situacao === 'finalizado') {
		frac = 1;
	} else if (dias == null) {
		frac = 0.18;
	} else if (dias < 0) {
		frac = 1;
	} else {
		frac = Math.min(1, Math.max(0.05, dias / 60));
	}

	const dash = circ * frac;
	const isLarge = size >= 80;
	const absD = dias == null ? null : Math.abs(dias);
	const label =
		situacao === 'finalizado' ? '✓' : absD == null ? '—' : String(absD);
	const unit =
		situacao === 'finalizado'
			? ''
			: dias == null
				? ''
				: dias < 0
					? 'ATRASO'
					: dias === 0
						? 'HOJE'
						: 'DIAS';

	const labelColor =
		situacao === 'vencido'
			? 'var(--status-vencido)'
			: situacao === 'finalizado'
				? color
				: 'var(--foreground)';

	return (
		<div
			className='relative inline-flex items-center justify-center'
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill='none'
					stroke='var(--border)'
					strokeWidth={stroke}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill='none'
					stroke={color}
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={`${dash} ${circ}`}
					style={{ transition: 'stroke-dasharray 0.5s ease' }}
				/>
			</svg>
			<div
				className='relative z-10 flex flex-col items-center justify-center leading-none select-none'
				style={{ gap: 1 }}
			>
				<span
					className='font-mono font-bold'
					style={{ fontSize: isLarge ? 26 : 15, color: labelColor, lineHeight: 1 }}
				>
					{label}
				</span>
				{unit && (
					<span
						style={{
							fontSize: isLarge ? 10 : 8,
							color,
							fontWeight: 800,
							letterSpacing: '0.04em',
							lineHeight: 1,
						}}
					>
						{unit}
					</span>
				)}
			</div>
		</div>
	);
}

export function SitPill({
	situacao,
	small = false,
}: {
	situacao: SituacaoPrazo;
	small?: boolean;
}) {
	const color = STATUS_COLOR[situacao];
	return (
		<span
			className='inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap'
			style={{
				padding: small ? '2px 7px' : '3px 9px',
				fontSize: small ? 11 : 12,
				background: `color-mix(in srgb, ${color} 14%, transparent)`,
				color,
			}}
		>
			<span
				className='rounded-full flex-shrink-0'
				style={{ width: 5, height: 5, background: color }}
			/>
			{SIT_LABELS[situacao]}
		</span>
	);
}
