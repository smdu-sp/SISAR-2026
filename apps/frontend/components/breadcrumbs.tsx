/** @format */

'use client';

import { usePathname } from 'next/navigation';

type PathMeta = { context: string; title: string };

function getPathMeta(pathname: string): PathMeta {
	const exact: Record<string, PathMeta> = {
		'/': { context: 'Visão geral', title: 'Painel de Prazos' },
		'/processos': { context: 'Processos', title: 'Processos' },
		'/processos/novo': { context: 'Processos', title: 'Novo processo' },
		'/agenda': { context: 'Agenda', title: 'Agenda' },
		'/perfil': { context: 'Conta', title: 'Meu perfil' },
		'/relatorios': { context: 'Administração', title: 'Relatórios' },
		'/alvara': { context: 'Administração', title: 'Tipos de Alvará' },
		'/categorias': { context: 'Administração', title: 'Categorias' },
		'/coordenadorias': { context: 'Administração', title: 'Coordenadorias' },
		'/diretorias': { context: 'Administração', title: 'Diretorias' },
		'/importar': { context: 'Administração', title: 'Importar dados' },
		'/motivos-inadmissao': { context: 'Administração', title: 'Motivos de Inadmissão' },
		'/parecer-admissibilidade': { context: 'Administração', title: 'Pareceres de Admissibilidade' },
		'/pedidos': { context: 'Administração', title: 'Pedidos' },
		'/subprefeitura': { context: 'Administração', title: 'Subprefeituras' },
		'/unidades': { context: 'Administração', title: 'Unidades' },
		'/usuarios': { context: 'Administração', title: 'Usuários' },
		'/dashboard/admissibilidade': { context: 'Dashboard', title: 'Admissibilidade' },
	};

	if (exact[pathname]) return exact[pathname];

	const processoMatch = pathname.match(/^\/processos\/(\d+)/);
	if (processoMatch) return { context: 'Processos', title: `Processo #${processoMatch[1]}` };

	if (pathname.startsWith('/usuarios/')) return { context: 'Administração', title: 'Usuário' };

	const segment = pathname.split('/').filter(Boolean).pop() ?? 'SISAR';
	return {
		context: '',
		title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
	};
}

export default function Breadcrumbs() {
	const pathname = usePathname();
	const { context, title } = getPathMeta(pathname);

	return (
		<div className='flex flex-col justify-center leading-tight gap-0.5'>
			{context && (
				<span className='text-[11px] text-muted-foreground font-medium leading-none'>
					{context}
				</span>
			)}
			<span className='text-[15px] font-semibold leading-tight text-foreground'>
				{title}
			</span>
		</div>
	);
}
