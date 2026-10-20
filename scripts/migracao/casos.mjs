// Casos de paridade por módulo. Cada caso: { metodo, caminho, como (dev|adm|usr|gab|null), corpo, ignorar }.
// "como: null" = sem token. Mutações usam apenas registros de teste e são idempotentes.

const sub = (token) => JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).sub;

export const casos = {
	auth: [
		{ metodo: 'POST', caminho: '/login', como: null, corpo: { login: 'd854440', senha: 'x' } },
		{ metodo: 'POST', caminho: '/login', como: null, corpo: {} },
		{ metodo: 'POST', caminho: '/login', como: null, corpo: { login: 123, senha: 'x' } },
		{ metodo: 'POST', caminho: '/refresh', como: null, corpo: (t) => ({ refresh_token: t.dev.refresh_token }) },
		{ metodo: 'POST', caminho: '/refresh', como: null, corpo: { refresh_token: 'invalido' } },
		{ metodo: 'POST', caminho: '/refresh', como: null, corpo: {} },
		{ caminho: '/eu', como: 'dev' },
		{ caminho: '/eu', como: 'gab' },
		{ caminho: '/eu', como: null },
	],

	usuarios: ({ tokensNest }) => {
		const idDev = sub(tokensNest.dev.access_token);
		return [
			{ caminho: '/usuarios/valida-usuario', como: 'dev' },
			{ caminho: '/usuarios/valida-usuario', como: 'gab' },
			{ caminho: '/usuarios/buscar-tudo', como: 'dev' },
			{ caminho: '/usuarios/buscar-tudo?pagina=1&limite=2', como: 'dev' },
			{ caminho: '/usuarios/buscar-tudo?pagina=1&limite=10&status=1&busca=Paridade', como: 'dev' },
			{ caminho: '/usuarios/buscar-tudo?permissao=GAB_ASC', como: 'adm' },
			{ caminho: '/usuarios/buscar-tudo', como: 'usr' },
			{ caminho: '/usuarios/buscar-tudo', como: 'gab' },
			{ caminho: '/usuarios/buscar-tudo', como: null },
			{ caminho: `/usuarios/buscar-por-id/${idDev}`, como: 'dev' },
			{ caminho: '/usuarios/buscar-por-id/nao-existe', como: 'dev' },
			{ caminho: '/usuarios/lista-completa', como: 'dev' },
			{ caminho: '/usuarios/buscar-administrativos', como: 'dev' },
			{ caminho: '/usuarios/buscar-funcionarios', como: 'usr' },
			{ caminho: '/usuarios/buscar-funcionarios', como: 'gab' },
			// rota inexistente também no Nest (o frontend a chama): continua 404
			{ caminho: '/usuarios/buscar-tecnicos', como: 'dev', semRota: true },
			{ metodo: 'PATCH', caminho: '/usuarios/autorizar/zz-par-usr', como: 'dev' },
			{ metodo: 'PATCH', caminho: '/usuarios/autorizar/nao-existe', como: 'dev' },
			{
				metodo: 'PATCH',
				caminho: '/usuarios/atualizar/zz-par-usr',
				como: 'dev',
				corpo: { nomeSocial: 'Paridade' },
				ignorar: ['alterado_em'],
			},
			{ metodo: 'PATCH', caminho: '/usuarios/atualizar/zz-par-usr', como: 'usr', corpo: { permissao: 'DEV' } },
			{
				metodo: 'POST',
				caminho: '/usuarios/criar',
				como: 'dev',
				corpo: { login: 'd854440', nome: 'Duplicado Teste', email: 'x@x.com' },
			},
			{ metodo: 'DELETE', caminho: '/usuarios/remover-substituto/nao-existe', como: 'dev' },
		];
	},

	permissoes: [
		{ caminho: '/permissoes/meus-recursos', como: 'dev' },
		{ caminho: '/permissoes/meus-recursos', como: 'gab' },
		{ caminho: '/permissoes/meus-recursos', como: 'usr' },
		{ caminho: '/permissoes', como: 'dev' },
		{ caminho: '/permissoes', como: 'adm' },
		{ caminho: '/permissoes', como: null },
		{ metodo: 'PUT', caminho: '/permissoes/USR', como: 'dev', corpo: { recursos: ['painel_inicial', 'processos', 'perfil'] } },
		{ metodo: 'PUT', caminho: '/permissoes/XXX', como: 'dev', corpo: { recursos: [] } },
		{ metodo: 'PUT', caminho: '/permissoes/USR', como: 'dev', corpo: { recursos: ['nao_existe'] } },
		{ metodo: 'PUT', caminho: '/permissoes/USR', como: 'dev', corpo: { recursos: 'x' } },
		{ metodo: 'PUT', caminho: '/permissoes/USR', como: 'adm', corpo: { recursos: [] } },
		{ metodo: 'POST', caminho: '/permissoes/restaurar-padrao', como: 'dev' },
	],
};
