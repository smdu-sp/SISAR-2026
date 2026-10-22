/**
 * Substituto mínimo de @nestjs/testing para os testes portados do backend:
 * Test.createTestingModule({ providers }).compile() e module.get(Token).
 * As dependências de cada service vêm de ../dependencias (gerado com o container).
 */
import { dependencias } from '../dependencias';
function criarModulo(providers) {
    const valores = new Map();
    const classes = new Set();
    for (const p of providers) {
        if (p && typeof p === 'object' && 'provide' in p) {
            const { provide, useValue } = p;
            valores.set(provide, useValue);
        }
        else
            classes.add(p);
    }
    const instancias = new Map();
    const modulo = {
        get(token) {
            if (valores.has(token))
                return valores.get(token);
            if (instancias.has(token))
                return instancias.get(token);
            if (!classes.has(token)) {
                throw new Error(`Nest can't resolve dependency: ${token?.name ?? token}`);
            }
            const deps = (dependencias.get(token) ?? []).map((d) => modulo.get(d));
            const Classe = token;
            const instancia = new Classe(...deps);
            instancias.set(token, instancia);
            return instancia;
        },
    };
    return modulo;
}
export const Test = {
    createTestingModule({ providers }) {
        return { compile: async () => criarModulo(providers) };
    },
};
