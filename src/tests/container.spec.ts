import fs from 'node:fs';
import path from 'node:path';
import { dependencias } from '../dependencias';

const SRC = path.join(__dirname, '..');

function arquivos(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) return e.name === 'tests' ? [] : arquivos(p);
		return e.name.endsWith('.service.ts') ? [p] : [];
	});
}

describe('Container e registro de dependências', () => {
	const servicos = arquivos(SRC);

	it('todo *.service.ts exporta uma classe registrada em dependencias.ts', () => {
		const registradas = new Set([...dependencias.keys()].map((c) => (c as { name: string }).name));
		const faltando: string[] = [];
		for (const arquivo of servicos) {
			for (const m of fs.readFileSync(arquivo, 'utf8').matchAll(/export class (\w+Service)\b/g)) {
				if (!registradas.has(m[1])) faltando.push(`${m[1]} (${path.relative(SRC, arquivo)})`);
			}
		}
		expect(faltando).toEqual([]);
	});

	it('a quantidade de dependências declaradas bate com o construtor de cada service', () => {
		const divergentes = [...dependencias.entries()]
			.filter(([classe, deps]) => (classe as { length: number }).length !== deps.length)
			.map(([classe]) => (classe as { name: string }).name);
		expect(divergentes).toEqual([]);
	});

	it('o container instancia todos os services registrados', () => {
		const container = fs.readFileSync(path.join(SRC, 'container.ts'), 'utf8');
		const naoInstanciados = [...dependencias.keys()]
			.map((c) => (c as { name: string }).name)
			.filter((nome) => !new RegExp(`new ${nome}\\(`).test(container));
		expect(naoInstanciados).toEqual([]);
	});
});
