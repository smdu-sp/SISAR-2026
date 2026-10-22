'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
	{ label: 'Todos', value: '-1' },
	{ label: 'Admissibilidade', value: '0' },
	{ label: 'Em Análise', value: '2' },
	{ label: 'Deferido', value: '3' },
	{ label: 'Indeferido', value: '4' },
] as const;

export function FaseTabs({ total }: { total?: number }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const current = searchParams.get('status') ?? '-1';

	function navigate(status: string) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('status', status);
		params.set('pagina', '1');
		router.push(`${pathname}?${params.toString()}`);
	}

	return (
		<div className='flex items-center justify-between gap-4 flex-wrap'>
			<div className='flex flex-wrap gap-1.5'>
				{TABS.map((tab) => (
					<button
						key={tab.value}
						onClick={() => navigate(tab.value)}
						className={cn(
							'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
							current === tab.value
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80',
						)}
					>
						{tab.label}
					</button>
				))}
			</div>
			{total != null && (
				<span className='text-xs text-muted-foreground font-medium shrink-0'>
					{total} processo{total !== 1 ? 's' : ''}
				</span>
			)}
		</div>
	);
}
