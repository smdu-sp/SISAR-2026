/* Gerado a partir de apps/backend/src/reunioes/reunioes.controller.ts (scripts/migracao/gerar-rotas.mjs) e revisado. */
import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('reunioes'). */
export const rotasReunioes = controller('reunioes', [
	// listaCompleta
	rota.get(
		'lista-completa',
		(ctx) => {
			return container().reunioes.listaCompleta();
		},
		{ recursos: ['reunioes'], status: 200 },
	),
	// buscarPorMesAno
	rota.get(
		'buscar/:mes/:ano',
		(ctx) => {
			const mes = ctx.params['mes'];
			const ano = ctx.params['ano'];
			return container().reunioes.buscarPorMesAno(parseInt(mes), parseInt(ano));
		},
		{ recursos: ['reunioes'], status: 200 },
	),
	// buscarPorData
	rota.get(
		'buscar-data/:date',
		(ctx) => {
			const data = ctx.params['date'] as any;
			return container().reunioes.buscarPorData(data)
		},
		{ recursos: ['reunioes'], status: 200 },
	),
	// buscarPorId
	rota.get(
		'buscar-inicial/:id',
		(ctx) => {
			const id = ctx.params['id'];
			return container().reunioes.buscarPorId(id)
		},
		{ recursos: ['reunioes'], status: 200 },
	),
	// buscarPorInicial
	rota.get(
		'por-processo/:inicialId',
		(ctx) => {
			const inicialId = ctx.params['inicialId'];
			return container().reunioes.buscarPorInicial(+inicialId);
		},
		{ recursos: ['reunioes', 'processos'], status: 200 },
	),
	// atualizarData
	rota.patch(
		'atualizar-data/:id',
		async (ctx) => {
			const id = ctx.params['id'];
			const updateReunioesDto = await ctx.corpo();
			return container().reunioes.atualizarData(id, updateReunioesDto)
		},
		{ recursos: ['reunioes'], status: 200 },
	),
]);
