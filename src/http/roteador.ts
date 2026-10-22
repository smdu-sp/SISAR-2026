import { HttpException, ehHttpException } from './errors';
import type { Contexto, Metodo, Rota, RotaCompilada } from './tipos';

/** Transforma "buscar-por-id/:id" e "ar/quantitativo/:mes?/:ano?" em expressão regular. */
function compilarCaminho(caminho: string): { regex: RegExp; nomes: string[] } {
	const nomes: string[] = [];
	const segmentos = caminho.split('/').filter(Boolean);
	let padrao = '';
	for (const seg of segmentos) {
		if (seg.startsWith(':')) {
			const opcional = seg.endsWith('?');
			nomes.push(seg.slice(1, opcional ? -1 : undefined));
			padrao += opcional ? '(?:/([^/]+))?' : '/([^/]+)';
		} else {
			padrao += '/' + seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}
	}
	// Como o Express: maiúsculas/minúsculas indiferentes e barra final opcional.
	return { regex: new RegExp(`^${padrao || ''}/?$`, 'i'), nomes };
}

function juntar(prefixo: string, caminho: string) {
	return [prefixo, caminho].filter(Boolean).join('/').replace(/\/+/g, '/');
}

/** Equivale a um @Controller('prefixo'): as rotas valem na ordem em que são declaradas. */
export function controller(prefixo: string, rotas: Rota[]): RotaCompilada[] {
	return rotas.map((rota) => ({
		...rota,
		...compilarCaminho(juntar(prefixo, rota.caminho)),
	}));
}

export const rota = {
	get: (caminho: string, handler: Rota['handler'], opcoes: Partial<Rota> = {}): Rota => ({
		metodo: 'GET',
		caminho,
		handler,
		...opcoes,
	}),
	post: (caminho: string, handler: Rota['handler'], opcoes: Partial<Rota> = {}): Rota => ({
		metodo: 'POST',
		caminho,
		handler,
		...opcoes,
	}),
	patch: (caminho: string, handler: Rota['handler'], opcoes: Partial<Rota> = {}): Rota => ({
		metodo: 'PATCH',
		caminho,
		handler,
		...opcoes,
	}),
	put: (caminho: string, handler: Rota['handler'], opcoes: Partial<Rota> = {}): Rota => ({
		metodo: 'PUT',
		caminho,
		handler,
		...opcoes,
	}),
	delete: (caminho: string, handler: Rota['handler'], opcoes: Partial<Rota> = {}): Rota => ({
		metodo: 'DELETE',
		caminho,
		handler,
		...opcoes,
	}),
};

export function encontrarRota(
	rotas: RotaCompilada[],
	metodo: string,
	caminho: string,
): { rota: RotaCompilada; params: Record<string, string | undefined> } | null {
	const metodoUpper = metodo.toUpperCase() as Metodo;
	for (const r of rotas) {
		if (r.metodo !== metodoUpper) continue;
		const m = r.regex.exec(caminho);
		if (!m) continue;
		const params: Record<string, string | undefined> = {};
		r.nomes.forEach((nome, i) => {
			params[nome] = m[i + 1] === undefined ? undefined : decodeURIComponent(m[i + 1]);
		});
		return { rota: r, params };
	}
	return null;
}

export function criarContexto(
	req: Request,
	params: Record<string, string | undefined>,
): Contexto {
	let corpoCache: unknown;
	let corpoLido = false;
	return {
		req,
		params,
		query: (nome) => new URL(req.url).searchParams.get(nome) ?? undefined,
		corpo: async <T,>() => {
			if (!corpoLido) {
				corpoLido = true;
				const texto = await req.text();
				if (!texto) corpoCache = {};
				else {
					try {
						corpoCache = JSON.parse(texto);
					} catch {
						throw new HttpException('Unexpected token in JSON', 400, 'Bad Request');
					}
				}
			}
			return corpoCache as T;
		},
		formData: () => req.formData(),
	};
}

/** Converte o retorno do handler em resposta HTTP, como o NestJS (Express) faz. */
export function montarResposta(resultado: unknown, status: number): Response {
	if (resultado instanceof Response) return resultado;
	if (resultado === undefined || resultado === null) return new Response(null, { status });
	if (typeof resultado === 'object' || Array.isArray(resultado)) {
		return new Response(JSON.stringify(resultado), {
			status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}
	return new Response(String(resultado), {
		status,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

export function respostaDeErro(erro: unknown): Response {
	if (ehHttpException(erro)) {
		return new Response(JSON.stringify(erro.corpo), {
			status: erro.status,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}
	console.error('[api] erro não tratado:', erro);
	return new Response(
		JSON.stringify({ statusCode: 500, message: 'Internal server error' }),
		{ status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
	);
}
