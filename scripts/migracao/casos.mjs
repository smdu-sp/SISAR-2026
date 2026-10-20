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

// ---------------- Fase 4: processos ----------------
// requerimento: cada lado cria com nome próprio; publicacao_parecer: hora atual da decisão.
const IGNORAR_PROCESSO = ['id', 'inicial_id', 'criado_em', 'alterado_em', 'sei', 'requerimento', 'publicacao_parecer', 'comunique_se_id', 'reuniao_id',
	// rodízio de administrativos depende da ordem de criação (verificado com ORDEM=next-primeiro)
	'administrativo_responsavel', 'administrativo_responsavel_id'];

async function idsBase({ NEST, tokensNest }) {
	const h = { headers: { Authorization: `Bearer ${tokensNest.dev.access_token}` } };
	const get = async (c) => (await fetch(NEST + c, h)).json();
	const [alvaras, unidades, subprefeituras, pareceres] = await Promise.all([
		get('/alvara-tipo/lista-completa'),
		get('/unidades/lista-completa'),
		get('/subprefeitura/lista-completa'),
		get('/parecer-admissibilidade/buscar-tudo?pagina=1&limite=5'),
	]);
	return {
		alvara: alvaras[0].id,
		unidade: unidades[0].id,
		subprefeitura: subprefeituras[0].id,
		parecer: (pareceres.data ?? pareceres)[0].id,
		idDev: sub(tokensNest.dev.access_token),
	};
}

const sufixo = Date.now() % 1_000_000;
const novoProcesso = (ids, tipo_processo = 1) => (_t, lado) => ({
	sei: `9999${lado === 'nest' ? 1 : 2}${String(sufixo).padStart(6, '0')}${tipo_processo}`,
	tipo_requerimento: 1,
	requerimento: `ZZ PARIDADE ${lado}`,
	aprova_digital: '',
	processo_fisico: '',
	data_protocolo: '2026-10-01',
	envio_admissibilidade: '2026-10-02',
	alvara_tipo_id: ids.alvara,
	tipo_processo,
	nums_sql: ['000.000.0000-0'],
});

Object.assign(casos, {
	'processos-leitura': [
		{ caminho: '/inicial/buscar-tudo?pagina=1&limite=10&status=-1', como: 'dev' },
		{ caminho: '/inicial/buscar-tudo?pagina=2&limite=5&busca=2018', como: 'usr' },
		{ caminho: '/inicial/buscar-tudo?pagina=1&limite=3&status=2', como: 'gab' },
		{ caminho: '/inicial/buscar-tudo-analise?pagina=1&limite=5', como: 'dev' },
		{ caminho: '/inicial/buscar/4/2018', como: 'dev' },
		{ caminho: '/inicial/buscar-por-id/2020', como: 'dev' },
		{ caminho: '/inicial/buscar-por-id/2022', como: 'usr' },
		{ caminho: '/inicial/buscar-por-id/2020', como: 'gab' },
		{ caminho: '/inicial/buscar-por-id/999999999', como: 'dev' },
		{ caminho: '/inicial/buscar-por-id/abc', como: 'dev' },
		{ caminho: '/inicial/buscar-data-processo/2018-04-03', como: 'dev' },
		{ caminho: '/inicial/valida-sql/000.000.0000-0', como: 'dev' },
		{ caminho: '/inicial/verifica-sei/000000201800351891', como: 'dev' },
		{ caminho: '/inicial/verifica-sei/123', como: 'dev' },
		{ caminho: '/inicial/busca-processos', como: 'dev' },
		{ caminho: '/admissibilidade/consulta', como: 'dev' },
		{ caminho: '/admissibilidade/buscar-tudo?pagina=1&limite=5', como: 'dev' },
		{ caminho: '/admissibilidade/buscar-id/2020', como: 'dev' },
		{ caminho: '/admissibilidade/lista', como: 'dev' },
		{ caminho: '/admissibilidade/lista', como: 'usr' },
		{ caminho: '/admissibilidade/contar-fora-prazo', como: 'gab' },
		{ caminho: '/admissibilidade/contar-dentro-prazo', como: 'dev' },
		{ caminho: '/admissibilidade/admissibilidade-finalizada', como: 'adm' },
		{ caminho: '/admissibilidade/mediana-admissibilidade', como: 'dev' },
		{ caminho: '/admissibilidade/registros-admissibilidade', como: 'dev' },
		{ caminho: '/admissibilidade/registros-admissibilidade', como: 'usr' },
		{ caminho: '/analise/contexto/2020', como: 'dev' },
		{ caminho: '/analise/contexto/2022', como: 'dev' },
		{ caminho: '/analise/contexto/2023', como: 'dev' },
		{ caminho: '/analise/contexto/999999999', como: 'dev' },
		{ caminho: '/finalizacao/buscar-tudo', como: 'dev' },
		{ caminho: '/finalizacao/buscar/2022', como: 'dev' },
		{ caminho: '/reconsideracao-admissibilidade/2035', como: 'dev' },
		{ caminho: '/reconsideracao-admissibilidade/2020', como: 'dev' },
		{ caminho: '/reunioes/lista-completa', como: 'dev' },
		{ caminho: '/reunioes/buscar/10/2026', como: 'dev' },
		{ caminho: '/reunioes/buscar-data/2026-10-10', como: 'dev' },
		{ caminho: '/reunioes/buscar-inicial/2022', como: 'dev' },
		{ caminho: '/reunioes/por-processo/2022', como: 'usr' },
		{ caminho: '/reunioes/lista-completa', como: 'usr' },
	],

	'processos-fluxo': async (contexto) => {
		const ids = await idsBase(contexto);
		const ignorar = IGNORAR_PROCESSO;
		const guardarId = (e, r) => (e.id = r.id);
		const p = (metodo, caminho, corpo, extra = {}) => ({ metodo, caminho, corpo, como: 'dev', ignorar, ...extra });
		return [
			{
				nome: 'admitir/análise/distribuição/finalização',
				fluxo: [
					p('POST', '/inicial/criar', novoProcesso(ids), { guardar: guardarId }),
					p('GET', (e) => `/inicial/buscar-por-id/${e.id}`),
					p('PATCH', (e) => `/inicial/atualizar/${e.id}`, { obs: 'paridade' }),
					p('PATCH', (e) => `/inicial/adiciona-sql/${e.id}`, { sql: '111.111.1111-1' }),
					p('DELETE', (e) => `/inicial/remove-sql/${e.id}/111.111.1111-1`),
					p('GET', (e) => `/admissibilidade/buscar-id/${e.id}`),
					p('POST', (e) => `/admissibilidade/admitir/${e.id}`, {
						unidade_id: ids.unidade, subprefeitura_id: ids.subprefeitura,
						data_decisao_interlocutoria: '2026-10-05', tipo_processo: 1,
					}),
					p('GET', (e) => `/analise/contexto/${e.id}`),
					p('POST', (e) => `/analise/comunique-se/${e.id}`, { data: '2026-10-06' }, { guardar: (e, r) => (e.comunique = r.id) }),
					p('PATCH', (e) => `/analise/comunique-se/${e.comunique}/resposta`, { data_resposta: '2026-10-08' }),
					p('POST', (e) => `/analise/decisao/${e.id}`, { parecer: 1, parecer_tecnico: 'ok' }),
					p('POST', '/distribuicao/criar', (_t, _l, e) => ({ inicial_id: e.id, tecnico_responsavel_id: ids.idDev, administrativo_responsavel_id: ids.idDev })),
					p('PATCH', (e) => `/distribuicao/atualizar/${e.id}`, { obs: 'paridade' }),
					p('PATCH', (e) => `/distribuicao/tecnico/atualizar/${e.id}`, { tecnico_responsavel_id: ids.idDev }),
					p('PATCH', (e) => `/distribuicao/administrativo/atualizar/${e.id}`, { administrativo_responsavel_id: ids.idDev }),
					p('POST', '/finalizacao/criar', (_t, _l, e) => ({
						inicial_id: e.id, data_apostilamento: '2026-10-10', data_conclusao: '2026-10-10', data_emissao: '2026-10-10',
						data_outorga: '2026-10-10', data_resposta: '2026-10-10', data_termo: '2026-10-10', num_alvara: 'ZZ-1', obs: 'x', outorga: false,
					})),
					p('GET', (e) => `/finalizacao/buscar/${e.id}`),
					p('PATCH', (e) => `/finalizacao/atualizar/${e.id}`, { obs: 'y' }),
					p('GET', (e) => `/inicial/buscar-por-id/${e.id}`),
				],
			},
			{
				nome: 'inadmitir/reconsideração',
				fluxo: [
					p('POST', '/inicial/criar', novoProcesso(ids), { guardar: guardarId }),
					p('POST', (e) => `/admissibilidade/inadmitir/${e.id}`, { parecer_admissibilidade_id: ids.parecer, obs: 'paridade' }),
					p('GET', (e) => `/reconsideracao-admissibilidade/${e.id}`),
					p('POST', (e) => `/reconsideracao-admissibilidade/pedido/${e.id}`, { pedido_reconsideracao: '2026-10-07' }),
					p('PATCH', (e) => `/reconsideracao-admissibilidade/aceitar/${e.id}`),
					p('GET', (e) => `/inicial/buscar-por-id/${e.id}`),
				],
			},
			{
				nome: 'GRAPROEM/pré-reunião/recurso',
				fluxo: [
					p('POST', '/inicial/criar', novoProcesso(ids, 2), { guardar: guardarId }),
					p('POST', (e) => `/admissibilidade/admitir/${e.id}`, {
						unidade_id: ids.unidade, subprefeitura_id: ids.subprefeitura, data_decisao_interlocutoria: '2026-10-05',
						tipo_processo: 2, interfaces: { interface_smt: false, num_smt: '6068202600000001' },
					}),
					p('POST', (e) => `/analise/pre-reuniao/${e.id}`, { data_reuniao: '2026-10-10', data_processo: '2026-10-09', numero_reuniao: '1' }, { guardar: (e, r) => (e.reuniao = r.id) }),
					p('GET', (e) => `/reunioes/por-processo/${e.id}`),
					p('PATCH', (e) => `/reunioes/atualizar-data/${e.reuniao}`, { nova_data_reuniao: '2026-10-12', justificativa_remarcacao: 'paridade' }),
					p('POST', (e) => `/analise/decisao/${e.id}`, { parecer: 2 }),
					p('POST', (e) => `/analise/recurso/${e.id}`),
					p('POST', (e) => `/analise/encerrar-recurso/${e.id}`),
					p('GET', (e) => `/analise/contexto/${e.id}`),
					p('PATCH', (e) => `/admissibilidade/atualizar-id/${e.id}`, { obs: 'z' }),
					p('DELETE', (e) => `/admissibilidade/${e.id}`, undefined, { comparar: 'status' }),
				],
			},
		];
	},
});

// ---------------- Fase 5: relatórios ----------------
const TIPOS_RELATORIO = ['ar-quantitativo', 'rr-quantitativo', 'ar-progressao-mensal', 'ar-gabinete-prefeito', 'ar-analise-admissibilidade', 'rr-analise-admissibilidade'];
const FILTROS = 'dataInicial=01-04-2018&dataFinal=30-06-2018&anoInicial=2018&anoFinal=2019&periodo=01-04-2018,30-06-2018';

Object.assign(casos, {
	relatorios: [
		{ caminho: '/relatorio/ar/quantitativo', como: 'dev' },
		{ caminho: '/relatorio/ar/quantitativo/4/2018', como: 'gab' },
		{ caminho: '/relatorio/ar/quantitativo/4/2018', como: 'usr' },
		{ caminho: '/relatorio/ar/quantitativo/4/2018', como: null },
		{ caminho: '/relatorio/rr/quantitativo/5/2018', como: 'adm' },
		{ caminho: '/relatorio/ar/progressao-mensal/2018/2019', como: 'dev' },
		{ caminho: '/relatorio/ar/progressao-mensal/2018', como: 'dev' },
		{ caminho: '/relatorio/ar/prazo-analise-admissibilidade/01-04-2018/30-06-2018', como: 'dev' },
		{ caminho: '/relatorio/ar/prazo-analise-admissibilidade/data-invalida/30-06-2018', como: 'dev' },
		{ caminho: '/relatorio/rr/prazo-analise-admissibilidade/01-01-2018/31-12-2019', como: 'gab' },
		{ caminho: '/relatorio/ar/gabinete-do-prefeito', como: 'dev' },
		...TIPOS_RELATORIO.flatMap((tipo) => [
			{ caminho: `/relatorio/exportar/${tipo}/excel?${FILTROS}`, como: 'dev', comparar: 'tipo' },
			{ caminho: `/relatorio/exportar/${tipo}/pdf?${FILTROS}`, como: 'gab', comparar: 'tipo' },
		]),
		{ caminho: '/relatorio/exportar/nao-existe/pdf', como: 'dev' },
		{ caminho: '/relatorio/exportar/ar-quantitativo/doc', como: 'dev' },
		{ caminho: '/relatorio/exportar/ar-analise-admissibilidade/pdf', como: 'dev' },
		{ caminho: '/relatorio/exportar/ar-quantitativo/pdf', como: 'usr' },
		{ metodo: 'POST', caminho: '/relatorio/enviar-email/ar-quantitativo/pdf', como: 'dev', corpo: { destinatarios: ['a@b.com'], periodo: '01-04-2018,30-06-2018' } },
		{ metodo: 'POST', caminho: '/relatorio/enviar-email/ar-quantitativo/pdf', como: 'adm', corpo: { destinatarios: ['a@b.com'] } },
	],

	'envio-relatorios': () => {
		const ignorar = ['id', 'agendamento_id', 'criado_em', 'alterado_em', 'executado_em', 'ultimo_envio_em', 'nome', 'criado_por_id'];
		return [
			{ caminho: '/relatorio-agendamentos', como: 'dev', ignorar },
			{ caminho: '/relatorio-agendamentos/status-email', como: 'dev' },
			{ caminho: '/relatorio-agendamentos', como: 'adm' },
			{ caminho: '/relatorio-agendamentos/nao-existe', como: 'dev' },
			{ metodo: 'POST', caminho: '/relatorio-agendamentos', como: 'dev', corpo: { nome: 'x', tipo_relatorio: 'nada', destinatarios: ['nao-email'], frequencia: 'MENSAL' } },
			{ metodo: 'POST', caminho: '/relatorio-agendamentos', como: 'dev', corpo: { nome: 'x', tipo_relatorio: 'ar-quantitativo', destinatarios: ['a@b.com'], frequencia: 'MENSAL' } },
			{ metodo: 'POST', caminho: '/relatorio-agendamentos', como: 'dev', corpo: { nome: 'x', tipo_relatorio: 'ar-quantitativo', destinatarios: ['a@b.com'], frequencia: 'MENSAL', dia_do_mes: 5, formato_pdf: false, formato_excel: false } },
			{
				nome: 'agendamento',
				fluxo: [
					{
						metodo: 'POST', caminho: '/relatorio-agendamentos', como: 'dev', ignorar,
						corpo: (_t, lado) => ({ nome: `zz_par_env_${lado}`, tipo_relatorio: 'ar-quantitativo', destinatarios: ['B@x.gov.br', 'b@x.gov.br'], frequencia: 'SEMANAL', dia_da_semana: 1, hora: 9, campo_extra: 'removido pelo whitelist' }),
						guardar: (e, r) => (e.id = r.id),
					},
					{ caminho: (e) => `/relatorio-agendamentos/${e.id}`, como: 'dev', ignorar },
					{ metodo: 'PATCH', caminho: (e) => `/relatorio-agendamentos/${e.id}`, como: 'dev', corpo: { hora: 'nove' }, ignorar },
					{ metodo: 'PATCH', caminho: (e) => `/relatorio-agendamentos/${e.id}`, como: 'dev', corpo: { frequencia: 'MENSAL', dia_do_mes: 31, minuto: 30 }, ignorar },
					{ metodo: 'POST', caminho: (e) => `/relatorio-agendamentos/${e.id}/executar`, como: 'dev', ignorar },
					{ caminho: (e) => `/relatorio-agendamentos/${e.id}/historico`, como: 'dev', ignorar },
					{ metodo: 'PATCH', caminho: (e) => `/relatorio-agendamentos/${e.id}`, como: 'dev', corpo: { ativo: false }, ignorar },
					{ metodo: 'DELETE', caminho: (e) => `/relatorio-agendamentos/${e.id}`, como: 'dev', ignorar },
				],
			},
		];
	},
});

const limpezaProcessos = [
	"DELETE FROM relatorio_agendamentos WHERE nome LIKE 'zz_par_%'",
	...[
		'suspensoes_prazo', 'controles_prazo', 'comunique_ses', 'decisoes', 'reuniao_processos', 'motivos_inadmissao_inicial',
		'pedidos_inicial', 'iniciais_sqls', 'avisos', 'admissibilidades', 'conclusoes', 'distribuicoes',
		'reconsideracoes_admissibilidade', 'interfaces',
	].map((t) => `DELETE FROM ${t} WHERE inicial_id IN (SELECT id FROM iniciais WHERE requerimento LIKE 'ZZ PARIDADE%')`),
	"DELETE FROM iniciais WHERE requerimento LIKE 'ZZ PARIDADE%'",
];

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
// processos de teste (fase 4): executados depois das tabelas acima
limpeza.push(...limpezaProcessos);
