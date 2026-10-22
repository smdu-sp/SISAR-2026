import fs from 'node:fs';
import path from 'node:path';
import { rotasMigradas } from '../rotas';

/**
 * Cobertura da migração: toda rota que o NestJS expunha precisa existir na nova API, e a nova API
 * não pode ter rota sem equivalente. A lista vem do log de inicialização do Nest
 * ("Mapped {/x, GET} route"), guardada em cobertura-rotas-nest.txt (gerada antes de remover o backend).
 */
const arquivo = path.join(__dirname, 'cobertura-rotas-nest.txt');

interface RotaNest {
	metodo: string;
	caminho: string;
}

function lerRotasNest(): RotaNest[] {
	if (!fs.existsSync(arquivo)) return [];
	return fs
		.readFileSync(arquivo, 'utf8')
		.split(/\r?\n/)
		.filter(Boolean)
		.map((linha) => {
			const [caminho, metodo] = linha.replace(/[{}]/g, '').split(', ');
			return { metodo, caminho };
		});
}

/** Troca :param e :param? por um valor qualquer para testar contra a expressão da rota. */
const exemplo = (caminho: string) => caminho.replace(/:\w+\??/g, 'x').replace(/\/+$/, '') || '/';

describe('Cobertura das rotas do NestJS', () => {
	const nest = lerRotasNest();

	it('a lista de rotas do Nest está presente', () => {
		expect(nest.length).toBeGreaterThan(100);
	});

	it('toda rota do Nest existe (mesmo método e caminho) na nova API', () => {
		const faltando = nest.filter(
			(n) => !rotasMigradas.some((r) => r.metodo === n.metodo && r.regex.test(exemplo(n.caminho))),
		);
		expect(faltando.map((n) => `${n.metodo} ${n.caminho}`)).toEqual([]);
	});

	it('não há rota nova sem equivalente no Nest', () => {
		const semEquivalente = rotasMigradas.filter(
			(r) => !nest.some((n) => n.metodo === r.metodo && r.regex.test(exemplo(n.caminho))),
		);
		expect(semEquivalente.map((r) => `${r.metodo} ${r.regex.source}`)).toEqual([]);
	});

	it('mesma quantidade de rotas', () => {
		expect(rotasMigradas.length).toBe(nest.length);
	});
});
