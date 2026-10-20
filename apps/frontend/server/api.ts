import type { NextRequest } from 'next/server';
import { ForbiddenException, UnauthorizedException } from './http/errors';
import { tokenBearer, verificarToken } from './http/autenticacao';
import { encaminharAoNest } from './http/proxy';
import {
	criarContexto,
	encontrarRota,
	montarResposta,
	respostaDeErro,
} from './http/roteador';
import type { RotaCompilada } from './http/tipos';

/**
 * Tabela de rotas já migradas para o Next. O que não estiver aqui é repassado
 * ao NestJS enquanto a migração não termina (ver docs/plano-migracao-fullstack.md).
 */
export const rotasApi: RotaCompilada[] = [];

const RECURSO_PADRAO = 'processos';
const QUALQUER_LOGADO = '*';

export async function tratarRequisicao(req: NextRequest, segmentos: string[]): Promise<Response> {
	const caminho = '/' + segmentos.map(encodeURIComponent).join('/');
	const achada = encontrarRota(rotasApi, req.method, '/' + segmentos.join('/'));
	if (!achada) return encaminharAoNest(req, caminho);

	const { rota, params } = achada;
	try {
		// Importado aqui para o proxy funcionar mesmo sem banco/variáveis de ambiente.
		const { container } = await import('./container');
		const ctx = criarContexto(req, params);

		if (!rota.publica) {
			if (rota.autenticacao === 'refresh') {
				const corpo = await ctx.corpo<{ refresh_token?: string }>();
				const payload = verificarToken(corpo.refresh_token, process.env.RT_SECRET);
				ctx.usuario = (await container.usuarios.buscarPorId(payload.sub)) ?? undefined;
				if (!ctx.usuario) throw new UnauthorizedException();
			} else {
				try {
					const payload = verificarToken(tokenBearer(req), process.env.JWT_SECRET);
					ctx.usuario = (await container.usuarios.buscarPorId(payload.sub)) ?? undefined;
					if (!ctx.usuario) throw new Error('Usuário não encontrado');
				} catch (erro) {
					// igual ao JwtAuthGuard: qualquer falha vira 401
					throw erro instanceof UnauthorizedException
						? new UnauthorizedException('Unauthorized')
						: new UnauthorizedException();
				}
				const recursos = rota.recursos ?? [RECURSO_PADRAO];
				if (
					!recursos.includes(QUALQUER_LOGADO) &&
					!(await container.permissoes.temAlgum(ctx.usuario.permissao, recursos))
				) {
					throw new ForbiddenException('Forbidden resource');
				}
			}
		}

		if (rota.antes) await rota.antes(ctx);
		const resultado = await rota.handler(ctx);
		return montarResposta(resultado, rota.status ?? (rota.metodo === 'POST' ? 201 : 200));
	} catch (erro) {
		return respostaDeErro(erro);
	}
}
