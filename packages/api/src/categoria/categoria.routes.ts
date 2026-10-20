/* Gerado a partir de apps/backend/src/categoria/categoria.controller.ts (scripts/migracao/gerar-rotas.mjs) e revisado. */
import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('categorias'). */
export const rotasCategoria = controller('categorias', [
	// criar
	rota.post(
		'criar',
		async (ctx) => {
			const dto = await ctx.corpo();
			return container().categoria.criar(dto);
		},
		{ recursos: ['categorias'], status: 201 },
	),
	// buscarTudo
	rota.get(
		'buscar-tudo',
		(ctx) => {
			const pagina = ctx.query('pagina');
			const limite = ctx.query('limite');
			const busca = ctx.query('busca');
			return container().categoria.buscarTudo(+pagina, +limite, busca);
		},
		{ status: 200 },
	),
	// listaCompleta
	rota.get(
		'lista-completa',
		(ctx) => {
			return container().categoria.listaCompleta();
		},
		{ status: 200 },
	),
	// buscarPorId
	rota.get(
		'buscar-por-id/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().categoria.buscarPorId(id);
		},
		{ status: 200 },
	),
	// atualizar
	rota.patch(
		'atualizar/:id',
		async (ctx) => {
			const id = ctx.params['id'];
			const dto = await ctx.corpo();
			return container().categoria.atualizar(id, dto);
		},
		{ recursos: ['categorias'], status: 200 },
	),
	// remover
	rota.delete(
		'remover/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().categoria.remover(id);
		},
		{ recursos: ['categorias'], status: 200 },
	),
]);
