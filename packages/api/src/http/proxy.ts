
const CABECALHOS_IGNORADOS = new Set(['host', 'connection', 'content-length', 'transfer-encoding']);

/**
 * Transição: rotas ainda não migradas são repassadas ao NestJS (API_PROXY_TARGET).
 * Remover quando o backend antigo for desligado.
 */
export async function encaminharAoNest(req: Request, caminho: string): Promise<Response> {
	const alvo = process.env.API_PROXY_TARGET;
	if (!alvo) {
		return Response.json(
			{ message: `Cannot ${req.method} ${caminho}`, error: 'Not Found', statusCode: 404 },
			{ status: 404 },
		);
	}

	const cabecalhos = new Headers();
	req.headers.forEach((valor, nome) => {
		if (!CABECALHOS_IGNORADOS.has(nome.toLowerCase())) cabecalhos.set(nome, valor);
	});

	const comCorpo = !['GET', 'HEAD'].includes(req.method);
	const resposta = await fetch(alvo.replace(/\/$/, '') + caminho + new URL(req.url).search, {
		method: req.method,
		headers: cabecalhos,
		body: comCorpo ? await req.arrayBuffer() : undefined,
		redirect: 'manual',
		cache: 'no-store',
	});

	const saida = new Headers();
	resposta.headers.forEach((valor, nome) => {
		// o fetch já decodificou o corpo; evita repassar cabeçalhos que não valem mais
		if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(nome.toLowerCase())) {
			saida.set(nome, valor);
		}
	});
	return new Response(resposta.body, { status: resposta.status, headers: saida });
}
