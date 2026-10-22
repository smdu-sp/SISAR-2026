import { ForbiddenException, NotFoundException, UnauthorizedException, ehHttpException } from './http/errors';
import { tokenBearer, verificarToken } from './http/autenticacao';
import {
	criarContexto,
	encontrarRota,
	montarResposta,
	respostaDeErro,
} from './http/roteador';
import type { RotaCompilada } from './http/tipos';
import { container } from './container';
import { rotasMigradas } from './rotas';

export const rotasApi: RotaCompilada[] = rotasMigradas;

const RECURSO_PADRAO = 'processos';
const QUALQUER_LOGADO = '*';

export async function tratarRequisicao(req: Request, segmentos: string[]): Promise<Response> {
	const caminho = '/' + segmentos.map(encodeURIComponent).join('/');
	const achada = encontrarRota(rotasApi, req.method, '/' + segmentos.join('/'));
	if (!achada) {
		return respostaDeErro(new NotFoundException(`Cannot ${req.method} ${caminho}`));
	}

	const { rota, params } = achada;
	try {
		const ctx = criarContexto(req, params);

		if (!rota.publica) {
			if (rota.autenticacao === 'refresh') {
				const corpo = await ctx.corpo<{ refresh_token?: string }>();
				const payload = verificarToken(corpo.refresh_token, process.env.RT_SECRET);
				ctx.usuario = (await container().usuarios.buscarPorId(payload.sub)) ?? undefined;
				// como o RtStrategy: usuário inexistente gera erro comum (500)
				if (!ctx.usuario) throw new Error('Usuário não encontrado');
			} else {
				try {
					const payload = verificarToken(tokenBearer(req), process.env.JWT_SECRET);
					ctx.usuario = (await container().usuarios.buscarPorId(payload.sub)) ?? undefined;
					if (!ctx.usuario) throw new Error('Usuário não encontrado');
				} catch (erro) {
					// igual ao JwtAuthGuard: qualquer falha vira 401
					throw ehHttpException(erro) && erro.status === 401
						? new UnauthorizedException('Unauthorized')
						: new UnauthorizedException();
				}
				const recursos = rota.recursos ?? [RECURSO_PADRAO];
				if (
					!recursos.includes(QUALQUER_LOGADO) &&
					!(await container().permissoes.temAlgum(ctx.usuario.permissao, recursos))
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

