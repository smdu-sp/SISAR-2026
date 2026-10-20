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

	// ---------------- Fase 3: cadastros ----------------
	categorias: crud({
		prefixo: '/categorias',
		criar: (lado) => ({ categoria: `zz_par_cat_${lado}`, descricao: 'paridade', divisao: 'D', competencia: 'C' }),
		atualizar: { descricao: 'paridade editada' },
		unico: ['categoria'],
		remover: (id) => `/categorias/remover/${id}`,
	}),
	pedidos: crud({
		prefixo: '/pedidos',
		criar: (lado) => ({ descricao: `zz_par_ped_${lado}` }),
		atualizar: (lado) => ({ descricao: `zz_par_ped2_${lado}` }),
		unico: ['descricao'],
		remover: (id) => `/pedidos/remover/${id}`,
	}),
	'motivos-inadmissao': crud({
		prefixo: '/motivos-inadmissao',
		criar: (lado) => ({ descricao: `zz_par_mot_${lado}` }),
		atualizar: (lado) => ({ descricao: `zz_par_mot2_${lado}` }),
		unico: ['descricao'],
		remover: (id) => `/motivos-inadmissao/remover/${id}`,
	}),
	subprefeitura: crud({
		prefixo: '/subprefeitura',
		criar: (lado) => ({ nome: `zz_par_sub_${lado}`, sigla: `ZZ${lado}`, status: 1 }),
		atualizar: (lado) => ({ sigla: `ZY${lado}` }),
		unico: ['nome', 'sigla'],
		listaCompleta: true,
	}),
	'parecer-admissibilidade': crud({
		prefixo: '/parecer-admissibilidade',
		criar: (lado) => ({ parecer: `zz_par_par_${lado}`, status: 1 }),
		atualizar: (lado) => ({ parecer: `zz_par_par2_${lado}` }),
		unico: ['parecer'],
		remover: (id) => `/parecer-admissibilidade/desativar/${id}`,
		semListaCompleta: true,
	}),
	'alvara-tipo': crud({
		prefixo: '/alvara-tipo',
		criar: (lado) => ({
			nome: `zz_par_alv_${lado}`,
			prazo_admissibilidade_smul: 7, reconsideracao_smul: 6, reconsideracao_smul_tipo: 1, analise_reconsideracao_smul: 4,
			prazo_analise_smul1: 4, prazo_analise_smul2: 3, prazo_emissao_alvara_smul: 2, prazo_admissibilidade_multi: 2,
			reconsideracao_multi: 2, reconsideracao_multi_tipo: 1, analise_reconsideracao_multi: 1, prazo_analise_multi1: 1,
			prazo_analise_multi2: 1, prazo_emissao_alvara_multi: 1, prazo_comunique_se: 1, prazo_encaminhar_coord: 1, status: 1,
		}),
		atualizar: { prazo_comunique_se: 9 },
		unico: ['nome'],
		extrasFluxo: [{ metodo: 'PATCH', caminho: (e) => `/alvara-tipo/auterar-status/${e.id}`, como: 'dev', corpo: { status: 0 } }],
	}),
	unidades: crud({
		prefixo: '/unidades',
		criar: (lado) => ({ nome: `zz_par_uni_${lado}`, sigla: `ZZU${lado}`, nivel: 'COORDENADORIA' }),
		atualizar: (lado) => ({ codigo: `ZZC${lado}` }),
		unico: ['nome', 'sigla', 'codigo'],
		remover: (id) => `/unidades/desativar/${id}`,
		metodoRemover: 'PATCH',
		extrasGet: ['/unidades/arvore', '/unidades/arvore?busca=zz_par', '/unidades/lista-completa?nivel=DIRETORIA', '/unidades/buscar-tudo?nivel=UNIDADE&filtro=1'],
	}),
	avisos: async ({ tokensNest }) => {
		const idDev = sub(tokensNest.dev.access_token);
		const ignorar = ['id', 'criado_em', 'alterado_em', 'titulo'];
		return [
			{ caminho: '/avisos/buscar/2026-10-21', como: 'dev' },
			{ caminho: '/avisos/buscar/10/2026', como: 'dev' },
			{ caminho: '/avisos/buscar/10/2026', como: 'gab' },
			{
				nome: 'aviso',
				fluxo: [
					{
						metodo: 'POST', caminho: '/avisos/criar', como: 'dev', ignorar,
						corpo: (_t, lado) => ({ titulo: `zz_par_aviso_${lado}`, descricao: 'paridade', data: '2026-10-21T12:00:00.000Z', inicial_id: 2020, usuario_id: idDev }),
						guardar: (e, r) => (e.id = r.id),
					},
					{ caminho: '/avisos/buscar/2026-10-21', como: 'dev', ignorar },
					{ caminho: '/avisos/buscar/10/2026', como: 'dev', ignorar },
					{ metodo: 'PATCH', caminho: (e) => `/avisos/atualizar/${e.id}`, como: 'dev', corpo: { descricao: 'editado' }, ignorar },
					{ metodo: 'DELETE', caminho: (e) => `/avisos/excluir/${e.id}`, como: 'dev', ignorar },
				],
			},
			{ metodo: 'DELETE', caminho: '/avisos/excluir/nao-existe', como: 'dev' },
		];
	},
	publicacoes: async ({ NEST, tokensNest }) => {
		const idDev = sub(tokensNest.dev.access_token);
		const unidades = await (await fetch(NEST + '/unidades/lista-completa', { headers: { Authorization: `Bearer ${tokensNest.dev.access_token}` } })).json();
		const ignorar = ['id', 'criado_em', 'alterado_em', 'numero_processo'];
		return [
			{ caminho: '/publicacoes/buscar-tudo', como: 'dev' },
			{ caminho: '/publicacoes/buscar-tudo?pagina=1&limite=5&tipo_documento=COMUNIQUESE&colegiado=all', como: 'dev' },
			{ caminho: '/publicacoes/buscar-tudo', como: 'usr' },
			{ caminho: '/publicacoes/buscar-tudo', como: 'gab' },
			{ caminho: '/publicacoes/buscar-por-id/nao-existe', como: 'dev' },
			{ metodo: 'POST', caminho: '/publicacoes/criar', como: 'usr', corpo: {} },
			{
				nome: 'publicação',
				fluxo: [
					{
						metodo: 'POST', caminho: '/publicacoes/criar', como: 'dev', ignorar,
						corpo: (_t, lado) => ({
							numero_processo: `zz_par_${lado}`, tipo_documento: 'COMUNIQUESE', colegiado: 'AR',
							data_emissao: '2026-10-01T00:00:00.000Z', data_publicacao: '2026-10-02T00:00:00.000Z', prazo: 10,
							tecnico_rf: idDev, unidade_id: unidades[0].id,
						}),
						guardar: (e, r) => (e.id = r.id),
					},
					{ caminho: (e) => `/publicacoes/buscar-por-id/${e.id}`, como: 'dev', ignorar },
					{ metodo: 'PATCH', caminho: (e) => `/publicacoes/atualizar/${e.id}`, como: 'dev', corpo: { prazo: 15 }, ignorar },
					{ caminho: '/publicacoes/buscar-tudo?busca=zz_par', como: 'dev', ignorar },
				],
			},
		];
	},
};

/** CRUD padrão: listas por perfil, busca inexistente e fluxo criar -> buscar -> editar -> listar -> remover. */
function crud({ prefixo, criar, atualizar, unico = [], remover, metodoRemover = 'DELETE', extrasGet = [], extrasFluxo = [], semListaCompleta }) {
	const ignorar = ['id', 'criado_em', 'alterado_em', ...unico];
	const corpoDe = (v) => (typeof v === 'function' ? (_t, lado) => v(lado) : v);
	const casosLista = [
		{ caminho: `${prefixo}/buscar-tudo`, como: 'dev' },
		{ caminho: `${prefixo}/buscar-tudo?pagina=1&limite=3`, como: 'dev' },
		{ caminho: `${prefixo}/buscar-tudo?pagina=2&limite=2&busca=a`, como: 'adm' },
		{ caminho: `${prefixo}/buscar-tudo`, como: 'usr' },
		{ caminho: `${prefixo}/buscar-tudo`, como: 'gab' },
		{ caminho: `${prefixo}/buscar-tudo`, como: null },
		...(semListaCompleta ? [] : [{ caminho: `${prefixo}/lista-completa`, como: 'dev' }, { caminho: `${prefixo}/lista-completa`, como: 'usr' }]),
		{ caminho: `${prefixo}/buscar-por-id/nao-existe`, como: 'dev' },
		...extrasGet.map((caminho) => ({ caminho, como: 'dev' })),
		{ metodo: 'POST', caminho: `${prefixo}/criar`, como: 'usr', corpo: {} },
		{ metodo: 'PATCH', caminho: `${prefixo}/atualizar/nao-existe`, como: 'dev', corpo: {} },
	];
	const fluxo = [
		{ metodo: 'POST', caminho: `${prefixo}/criar`, como: 'dev', corpo: corpoDe(criar), ignorar, guardar: (e, r) => (e.id = r.id) },
		{ caminho: (e) => `${prefixo}/buscar-por-id/${e.id}`, como: 'dev', ignorar },
		{ metodo: 'PATCH', caminho: (e) => `${prefixo}/atualizar/${e.id}`, como: 'dev', corpo: corpoDe(atualizar), ignorar },
		{ caminho: `${prefixo}/buscar-tudo?busca=zz_par&limite=50`, como: 'dev', ignorar },
		...extrasFluxo.map((p) => ({ ...p, ignorar })),
		...(remover ? [{ metodo: metodoRemover, caminho: (e) => remover(e.id), como: 'dev', ignorar }] : []),
	];
	return [...casosLista, { nome: prefixo.slice(1), fluxo }];
}

/** Registros de teste sem exclusão pela API (removidos ao final). */
export const limpeza = [
	"DELETE FROM subprefeituras WHERE nome LIKE 'zz_par_%'",
	"DELETE FROM pareceres_admissibilidade WHERE parecer LIKE 'zz_par_%'",
	"DELETE FROM alvara_tipos WHERE nome LIKE 'zz_par_%'",
	"DELETE FROM publicacoes WHERE numero_processo LIKE 'zz_par_%'",
	"DELETE FROM unidades WHERE nome LIKE 'zz_par_%'",
	"DELETE FROM categorias WHERE categoria LIKE 'zz_par_%'",
	"DELETE FROM pedidos WHERE descricao LIKE 'zz_par_%'",
	"DELETE FROM motivos_inadmissao WHERE descricao LIKE 'zz_par_%'",
	"DELETE FROM avisos WHERE titulo LIKE 'zz_par_%'",
];
