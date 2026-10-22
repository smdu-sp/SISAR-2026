import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('parecer-admissibilidade'). */
export const rotasParecerAdmissibilidade = controller('parecer-admissibilidade', [
	// create
	rota.post(
		'criar',
		async (ctx) => {
			const createParecerAdmissibilidadeDto = await ctx.corpo();
			return container().parecerAdmissibilidade.criar(createParecerAdmissibilidadeDto);
		},
		{ recursos: ['pareceres'], status: 201 },
	),
	// buscarTudo
	rota.get(
		'buscar-tudo',
		(ctx) => {
			const pagina = ctx.query('pagina');
			const limite = ctx.query('limite');
			const busca = ctx.query('busca');
			return container().parecerAdmissibilidade.buscarTudo(+pagina, +limite, busca);
		},
		{ status: 200 },
	),
	// buscarPorId
	rota.get(
		'buscar-por-id/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().parecerAdmissibilidade.buscarPorId(id);
		},
		{ status: 200 },
	),
	// atualizar
	rota.patch(
		'atualizar/:id',
		async (ctx) => {
			const id = ctx.params['id'];
			const updateParecerAdmissibilidadeDto = await ctx.corpo();
			return container().parecerAdmissibilidade.atualizar(id, updateParecerAdmissibilidadeDto);
		},
		{ recursos: ['pareceres'], status: 200 },
	),
	// desativar
	rota.delete(
		'desativar/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().parecerAdmissibilidade.desativar(id);
		},
		{ recursos: ['pareceres'], status: 200 },
	),
]);
