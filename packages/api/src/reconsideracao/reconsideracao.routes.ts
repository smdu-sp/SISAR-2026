import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('reconsideracao-admissibilidade'). */
export const rotasReconsideracao = controller('reconsideracao-admissibilidade', [
	// buscar
	rota.get(
		':inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().reconsideracao.buscar(+inicialId);
		},
		{ status: 200 },
	),
	// registrarPedido
	rota.post(
		'pedido/:inicialId',
		async (ctx) => {
			const inicialId = ctx.params['inicialId'];
			const dto = await ctx.corpo();
			return container().reconsideracao.registrarPedido(+inicialId, dto);
		},
		{ status: 201 },
	),
	// aceitar
	rota.patch(
		'aceitar/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().reconsideracao.aceitar(+inicialId);
		},
		{ status: 200 },
	),
	// rejeitar
	rota.patch(
		'rejeitar/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().reconsideracao.rejeitar(+inicialId);
		},
		{ status: 200 },
	),
]);
