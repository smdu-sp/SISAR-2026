/**
 * Substituto mínimo de @nestjs/testing para os testes portados do backend:
 * Test.createTestingModule({ providers }).compile() e module.get(Token).
 * As dependências de cada service vêm de ../dependencias (gerado com o container).
 */
import { dependencias } from '../dependencias';

type Token = unknown;
type Provider = Token | { provide: Token; useValue: unknown };

export interface TestingModule {
	get<T = any>(token: Token): T;
}

function criarModulo(providers: Provider[]): TestingModule {
	const valores = new Map<Token, unknown>();
	const classes = new Set<Token>();
	for (const p of providers) {
		if (p && typeof p === 'object' && 'provide' in (p as object)) {
			const { provide, useValue } = p as { provide: Token; useValue: unknown };
			valores.set(provide, useValue);
		} else classes.add(p);
	}
	const instancias = new Map<Token, unknown>();
	const modulo: TestingModule = {
		get(token: Token) {
			if (valores.has(token)) return valores.get(token) as any;
			if (instancias.has(token)) return instancias.get(token) as any;
			if (!classes.has(token)) {
				throw new Error(`Nest can't resolve dependency: ${(token as { name?: string })?.name ?? token}`);
			}
			const deps = (dependencias.get(token) ?? []).map((d) => modulo.get(d));
			const Classe = token as new (...args: unknown[]) => unknown;
			const instancia = new Classe(...deps);
			instancias.set(token, instancia);
			return instancia as any;
		},
	};
	return modulo;
}

export const Test = {
	createTestingModule({ providers }: { providers: Provider[] }) {
		return { compile: async () => criarModulo(providers) };
	},
};
