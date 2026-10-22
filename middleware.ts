/** @format */

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/lib/auth/auth.config';
import { buscarMeusRecursos } from '@/lib/recursos';
import {
	primeiraRotaPermitida,
	recursoDaRota,
	rotaPermitida,
} from '@/lib/permissoes';

const { auth } = NextAuth({
	session: { strategy: 'jwt' },
	secret: process.env.AUTH_SECRET,
	trustHost: true,
	...authConfig,
});

// Evita uma consulta ao backend a cada requisição de navegação/prefetch.
const TTL_MS = 15_000;
const cache = new Map<string, { recursos: string[]; expiraEm: number }>();

async function recursosDoUsuario(accessToken: string) {
	const guardado = cache.get(accessToken);
	if (guardado && guardado.expiraEm > Date.now()) return guardado.recursos;
	const recursos = await buscarMeusRecursos(accessToken);
	if (recursos) {
		if (cache.size > 200) cache.clear();
		cache.set(accessToken, { recursos, expiraEm: Date.now() + TTL_MS });
	}
	return recursos;
}

// Bloqueia telas que o perfil do usuário não pode acessar (gestão em /permissoes).
// O backend valida cada endpoint; aqui evitamos telas quebradas.
export default auth(async (req) => {
	const pathname = req.nextUrl.pathname;
	const accessToken = req.auth?.access_token;
	if (!accessToken || recursoDaRota(pathname) === null) {
		return NextResponse.next();
	}

	const recursos = await recursosDoUsuario(accessToken);
	// Sem resposta do backend: não bloqueia (a API ainda recusa o que não for permitido).
	if (!recursos || rotaPermitida(pathname, recursos)) return NextResponse.next();

	const destino = primeiraRotaPermitida(recursos);
	if (!destino || destino === pathname) return NextResponse.next();
	return NextResponse.redirect(new URL(destino, req.nextUrl));
});

export const config = {
	matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
