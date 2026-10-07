/** @format */

/**
 * Mapa rota -> recurso (as chaves vêm do catálogo do backend, em
 * `apps/backend/src/permissoes/recursos.ts`). A tela de permissões define
 * quais recursos cada perfil acessa.
 */
const RECURSO_POR_ROTA: { prefixo: string; recurso: string }[] = [
	{ prefixo: '/permissoes', recurso: 'permissoes' },
	{ prefixo: '/envio-relatorios', recurso: 'envio_relatorios' },
	{ prefixo: '/relatorios', recurso: 'relatorios' },
	{ prefixo: '/dashboard/admissibilidade', recurso: 'dashboard_admissibilidade' },
	{ prefixo: '/usuarios', recurso: 'usuarios' },
	{ prefixo: '/unidades', recurso: 'unidades' },
	{ prefixo: '/subprefeitura', recurso: 'subprefeituras' },
	{ prefixo: '/alvara', recurso: 'alvaras' },
	{ prefixo: '/parecer-admissibilidade', recurso: 'pareceres' },
	{ prefixo: '/categorias', recurso: 'categorias' },
	{ prefixo: '/motivos-inadmissao', recurso: 'motivos_inadmissao' },
	{ prefixo: '/pedidos', recurso: 'pedidos' },
	{ prefixo: '/importar', recurso: 'importar' },
	{ prefixo: '/perfil', recurso: 'perfil' },
	{ prefixo: '/processos', recurso: 'processos' },
	{ prefixo: '/agenda', recurso: 'processos' },
	{ prefixo: '/admissibilidade', recurso: 'processos' },
	{ prefixo: '/analise', recurso: 'processos' },
	{ prefixo: '/publicacoes', recurso: 'processos' },
];

/** Ordem de preferência para onde mandar quem acessa uma rota sem permissão. */
const ROTAS_INICIAIS = [
	'/',
	'/processos',
	'/relatorios',
	'/dashboard/admissibilidade',
	'/perfil',
];

function casa(pathname: string, prefixo: string) {
	return pathname === prefixo || pathname.startsWith(`${prefixo}/`);
}

/** Recurso exigido pela rota; null quando a rota não é controlada (ex.: 404). */
export function recursoDaRota(pathname: string): string | null {
	if (pathname === '/') return 'painel_inicial';
	return RECURSO_POR_ROTA.find((r) => casa(pathname, r.prefixo))?.recurso ?? null;
}

export function rotaPermitida(pathname: string, recursos: string[]) {
	const recurso = recursoDaRota(pathname);
	return recurso === null || recursos.includes(recurso);
}

/** Primeira rota que o usuário pode abrir; null se não puder abrir nenhuma. */
export function primeiraRotaPermitida(recursos: string[]): string | null {
	return ROTAS_INICIAIS.find((rota) => rotaPermitida(rota, recursos)) ?? null;
}
