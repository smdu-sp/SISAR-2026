/* Gerado a partir de apps/backend/src/analise/analise.controller.ts (scripts/migracao/gerar-rotas.mjs) e revisado. */
import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('analise'). */
export const rotasAnalise = controller('analise', [
	// obterContexto
	rota.get(
		'contexto/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().analise.obterContexto(+inicialId);
		},
		{ status: 200 },
	),
	// registrarPreReuniao
	rota.post(
		'pre-reuniao/:inicialId',
		async (ctx) => {
			const inicialId = ctx.params['inicialId'];
			const dto = await ctx.corpo();
			return container().analise.registrarPreReuniao(+inicialId, dto);
		},
		{ status: 201 },
	),
	// registrarComuniqueSe
	rota.post(
		'comunique-se/:inicialId',
		async (ctx) => {
			const inicialId = ctx.params['inicialId'];
			const dto = await ctx.corpo();
			return container().analise.registrarComuniqueSe(+inicialId, dto);
		},
		{ status: 201 },
	),
	// registrarRespostaComuniqueSe
	rota.patch(
		'comunique-se/:id/resposta',
		async (ctx) => {
			const id = ctx.params['id'];
			const dto = await ctx.corpo();
			return container().analise.registrarRespostaComuniqueSe(
				id,
				dto.data_resposta,
			);
		},
		{ status: 200 },
	),
	// registrarDecisao
	rota.post(
		'decisao/:inicialId',
		async (ctx) => {
			const inicialId = ctx.params['inicialId'];
			const dto = await ctx.corpo();
			return container().analise.registrarDecisao(+inicialId, dto);
		},
		{ status: 200 },
	),
	// registrarRecurso
	rota.post(
		'recurso/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().analise.registrarRecurso(+inicialId);
		},
		{ status: 200 },
	),
	// encerrarSemRecurso
	rota.post(
		'encerrar-recurso/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().analise.encerrarSemRecurso(+inicialId);
		},
		{ status: 200 },
	),
]);
