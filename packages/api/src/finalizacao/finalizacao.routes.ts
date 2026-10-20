import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('finalizacao'). */
export const rotasFinalizacao = controller('finalizacao', [
	// create
	rota.post(
		'criar',
		async (ctx) => {
			const createFinalizacaoDto = await ctx.corpo();
			return container().finalizacao.criar(createFinalizacaoDto);
		},
		{ status: 201 },
	),
	// findAll
	rota.get(
		'buscar-tudo',
		(ctx) => {
			const pagina = ctx.query('pagina');
			const limite = ctx.query('limite');
			const busca = ctx.query('busca');
			return container().finalizacao.buscarTudo(+pagina, +limite, busca);
		},
		{ status: 200 },
	),
	// findOne
	rota.get(
		'buscar/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().finalizacao.buscaId(+id);
		},
		{ status: 200 },
	),
	// update
	rota.patch(
		'atualizar/:id',
		async (ctx) => {
			const id = ctx.params['id'];
			const updateFinalizacaoDto = await ctx.corpo();
			return container().finalizacao.atualizar(+id, updateFinalizacaoDto);
		},
		{ status: 200 },
	),
]);
