import { container } from '../container';
import { controller, rota } from '../http/roteador';

/** Antigo controller @Controller('distribuicao'). */
export const rotasDistribuicao = controller('distribuicao', [
	// criar
	rota.post(
		'criar',
		async (ctx) => {
			const createDistribuicaoDto = await ctx.corpo();
			return container().distribuicao.criar(createDistribuicaoDto);
		},
		{ status: 201 },
	),
	// atualizar
	rota.patch(
		'atualizar/:inicial_id',
		async (ctx) => {
			const inicial_id = ctx.params['inicial_id'];
			const updateDistribuicaoDto = await ctx.corpo();
			return container().distribuicao.atualizar(+inicial_id, updateDistribuicaoDto);
		},
		{ status: 200 },
	),
	// mudarAdministrativoResponsavel
	rota.patch(
		'administrativo/atualizar/:inicial_id',
		async (ctx) => {
			const inicial_id = ctx.params['inicial_id'];
			const { administrativo_responsavel_id } = await ctx.corpo();
			return container().distribuicao.mudarAdministrativoResponsavel(+inicial_id, administrativo_responsavel_id);
		},
		{ status: 200 },
	),
	// mudarTecnicoResponsavel
	rota.patch(
		'tecnico/atualizar/:inicial_id',
		async (ctx) => {
			const inicial_id = ctx.params['inicial_id'];
			const { tecnico_responsavel_id } = await ctx.corpo();
			return container().distribuicao.mudarTecnicoResponsavel(+inicial_id, tecnico_responsavel_id);
		},
		{ status: 200 },
	),
]);
