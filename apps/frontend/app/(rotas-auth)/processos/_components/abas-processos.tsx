'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const ABAS = [
	{ value: 'processos', label: 'Processos' },
	{ value: 'publicacoes', label: 'Publicações' },
] as const;

type AbaValue = (typeof ABAS)[number]['value'];

export function AbasProcessos({ aba }: { aba: string }) {
	const router = useRouter();
	const pathname = usePathname();

	function navigate(valor: AbaValue) {
		// Ao trocar de aba, limpa os filtros da aba anterior
		router.push(`${pathname}?aba=${valor}`);
	}

	return (
		<div className='border-b border-border mb-5'>
			<div className='flex gap-0'>
				{ABAS.map((a) => (
					<button
						key={a.value}
						onClick={() => navigate(a.value)}
						className={cn(
							'px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px',
							aba === a.value
								? 'border-primary text-primary'
								: 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
						)}
					>
						{a.label}
					</button>
				))}
			</div>
		</div>
	);
}
