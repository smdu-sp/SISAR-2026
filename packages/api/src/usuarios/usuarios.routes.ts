import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo UsuariosController (@Controller('usuarios')). */
export const rotasUsuarios = controller('usuarios', [
	rota.post('criar', async (ctx) => container().usuarios.criar(await ctx.corpo(), ctx.usuario), {
		recursos: ['usuarios'],
		status: 201,
	}),
	rota.get(
		'buscar-tudo',
		(ctx) =>
			container().usuarios.buscarTudo(
				ctx.usuario,
				+ctx.query('pagina'),
				+ctx.query('limite'),
				ctx.query('status'),
				ctx.query('busca'),
				ctx.query('permissao'),
			),
		{ recursos: ['usuarios'] },
	),
	rota.get('buscar-por-id/:id', (ctx) => container().usuarios.buscarPorId(ctx.params.id), {
		recursos: ['usuarios'],
	}),
	rota.patch(
		'atualizar/:id',
		async (ctx) => container().usuarios.atualizar(ctx.usuario, ctx.params.id, await ctx.corpo()),
		{ recursos: ['usuarios'] },
	),
	rota.get('lista-completa', () => container().usuarios.listaCompleta(), { recursos: ['usuarios'] }),
	rota.delete('desativar/:id', (ctx) => container().usuarios.excluir(ctx.params.id), {
		recursos: ['usuarios'],
	}),
	rota.patch('autorizar/:id', (ctx) => container().usuarios.autorizaUsuario(ctx.params.id), {
		recursos: ['usuarios'],
	}),
	rota.patch(
		'adiciona-ferias/:id',
		async (ctx) => container().usuarios.adicionaFerias(ctx.params.id, await ctx.corpo()),
		{ recursos: ['usuarios'] },
	),
	rota.get('valida-usuario', (ctx) => container().usuarios.validaUsuario(ctx.usuario.id), {
		recursos: ['*'],
	}),
	rota.get('buscar-novo', (ctx) => container().usuarios.buscarNovo(ctx.query('login')), {
		recursos: ['usuarios'],
	}),
	rota.get('buscar-administrativos', () => container().usuarios.buscarAdministrativos(), {
		recursos: ['usuarios'],
	}),
	rota.get('buscar-funcionarios', () => container().usuarios.buscarFuncionarios(), {
		recursos: ['usuarios', 'processos'],
	}),
	rota.post(
		'adicionar-substituto',
		async (ctx) => {
			const { usuario_id, substituto_id } = await ctx.corpo();
			return container().usuarios.adicionarSubstituto(usuario_id, substituto_id);
		},
		{ recursos: ['usuarios'], status: 201 },
	),
	rota.delete('remover-substituto/:id', (ctx) => container().usuarios.removerSubstituto(ctx.params.id), {
		recursos: ['usuarios'],
	}),
]);
