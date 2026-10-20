import { Permissao } from '@prisma/client';
import { container } from '../container';
import { BadRequestException } from '../http/errors';
import { controller, rota } from '../http/roteador';
import { validarDto } from '../http/validar';
import { DefinirPermissoesDto } from './dto/definir-permissoes.dto';
import { RECURSO_TRAVADO } from './recursos';

/** Igual ao ParseEnumPipe(Permissao) do Nest. */
function perfilValido(valor: string): Permissao {
	if (!Object.values(Permissao).includes(valor as Permissao)) {
		throw new BadRequestException(
			`Validation failed (enum string is expected)`,
		);
	}
	return valor as Permissao;
}

/** Antigo PermissoesController (@Controller('permissoes')). */
export const rotasPermissoes = controller('permissoes', [
	rota.get(
		'meus-recursos',
		async (ctx) => ({ recursos: await container().permissoes.recursosDoPerfil(ctx.usuario.permissao) }),
		{ recursos: ['*'] },
	),
	rota.get('', () => container().permissoes.matriz(), { recursos: [RECURSO_TRAVADO] }),
	rota.put(
		':perfil',
		async (ctx) => {
			const perfil = perfilValido(ctx.params.perfil);
			const dto = await validarDto(DefinirPermissoesDto, await ctx.corpo());
			return container().permissoes.definir(perfil, dto.recursos);
		},
		{ recursos: [RECURSO_TRAVADO] },
	),
	rota.post('restaurar-padrao', () => container().permissoes.restaurarPadrao(), {
		recursos: [RECURSO_TRAVADO],
		status: 200,
	}),
]);
