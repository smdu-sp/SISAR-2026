/* Gerado a partir de apps/backend/src/pedido/pedido.controller.ts (scripts/migracao/gerar-rotas.mjs) e revisado. */
import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('pedidos'). */
export const rotasPedido = controller('pedidos', [
	// criar
	rota.post(
		'criar',
		async (ctx) => {
			const dto = await ctx.corpo();
			return container().pedido.criar(dto);
		},
		{ recursos: ['pedidos'], status: 201 },
	),
	// buscarTudo
	rota.get(
		'buscar-tudo',
		(ctx) => {
			const pagina = ctx.query('pagina');
			const limite = ctx.query('limite');
			const busca = ctx.query('busca');
			return container().pedido.buscarTudo(+pagina, +limite, busca);
		},
		{ status: 200 },
	),
	// listaCompleta
	rota.get(
		'lista-completa',
		(ctx) => {
			return container().pedido.listaCompleta();
		},
		{ status: 200 },
	),
	// buscarPorId
	rota.get(
		'buscar-por-id/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().pedido.buscarPorId(id);
		},
		{ status: 200 },
	),
	// atualizar
	rota.patch(
		'atualizar/:id',
		async (ctx) => {
			const id = ctx.params['id'];
			const dto = await ctx.corpo();
			return container().pedido.atualizar(id, dto);
		},
		{ recursos: ['pedidos'], status: 200 },
	),
	// remover
	rota.delete(
		'remover/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().pedido.remover(id);
		},
		{ recursos: ['pedidos'], status: 200 },
	),
]);
