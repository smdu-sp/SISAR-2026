// Paridade NestJS x Next.js: envia as mesmas requisições às duas APIs e compara status e corpo.
// Uso: node scripts/migracao/paridade.mjs <modulo|todos>
// Variáveis: NEST (http://localhost:3055), NEXT (http://localhost:3056/api)
// Requer usuários de teste criados pelo próprio script (removidos ao final) no banco de desenvolvimento.
import { spawnSync } from 'node:child_process';
import { casos, limpeza } from './casos.mjs';

const NEST = process.env.NEST || 'http://localhost:3055';
const NEXT = process.env.NEXT || 'http://localhost:3056/api';
const alvo = process.argv[2] || 'todos';

const USUARIOS = {
	dev: 'd854440',
	adm: 'zz_par_adm',
	usr: 'zz_par_usr',
	gab: 'zz_par_gab',
};

function sql(comando) {
	// SQL pela entrada padrão: evita problemas de aspas no shell.
	const r = spawnSync(
		'docker',
		['exec', '-i', process.env.MYSQL_CONTAINER || 'mysql-chamados', 'sh', '-c', 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -N sisar'],
		{ input: comando, encoding: 'utf8' },
	);
	if (r.status !== 0) throw new Error('SQL falhou: ' + r.stderr);
	return r.stdout.trim();
}

function criarUsuariosTeste() {
	sql(
		"INSERT IGNORE INTO usuarios (id, login, nome, email, permissao, status, criado_em, alterado_em) VALUES " +
			"('zz-par-adm','zz_par_adm','Paridade Adm','zza@par.local','ADM',1,NOW(3),NOW(3))," +
			"('zz-par-usr','zz_par_usr','Paridade Usr','zzu@par.local','USR',1,NOW(3),NOW(3))," +
			"('zz-par-gab','zz_par_gab','Paridade Gab','zzg@par.local','GAB_ASC',1,NOW(3),NOW(3))",
	);
}

function removerUsuariosTeste() {
	sql("DELETE FROM usuarios WHERE id LIKE 'zz-par-%' OR login LIKE 'zz_par_%'");
}

async function login(base, login) {
	const r = await fetch(base + '/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login, senha: 'x' }),
	});
	const j = await r.json();
	if (!j.access_token) throw new Error(`login ${login} falhou em ${base}: ${JSON.stringify(j)}`);
	return j;
}

function normalizar(valor) {
	if (Array.isArray(valor)) return valor.map(normalizar);
	if (valor && typeof valor === 'object') {
		const saida = {};
		for (const [k, v] of Object.entries(valor).sort(([a], [b]) => a.localeCompare(b))) {
			saida[k] = ['access_token', 'refresh_token'].includes(k) ? '<jwt>' : normalizar(v);
		}
		return saida;
	}
	return valor;
}

async function chamar(base, caso, tokens, lado = 'nest', estado = {}) {
	const headers = { 'Content-Type': 'application/json' };
	if (caso.como) headers.Authorization = `Bearer ${tokens[caso.como].access_token}`;
	let corpo = caso.corpo;
	if (typeof corpo === 'function') corpo = corpo(tokens, lado, estado);
	const caminho = typeof caso.caminho === 'function' ? caso.caminho(estado, lado) : caso.caminho;
	const r = await fetch(base + caminho, {
		method: caso.metodo || 'GET',
		headers,
		body: corpo === undefined ? undefined : JSON.stringify(corpo),
	});
	const tipo = r.headers.get('content-type') || '';
	const bruto = Buffer.from(await r.arrayBuffer());
	let corpoResp;
	let json;
	if (tipo.includes('application/json')) corpoResp = normalizar((json = JSON.parse(bruto.toString('utf8'))));
	else if (tipo.includes('text/')) corpoResp = bruto.toString('utf8');
	else corpoResp = `<${tipo} ${bruto.length} bytes>`;
	if (caso.guardar && json) caso.guardar(estado, json);
	return { status: r.status, tipo: tipo.split(';')[0], corpo: corpoResp, origem: r.headers.get('x-sisar-api'), caminho };
}

/** Remove campos (em qualquer nível) que variam entre os lados, como id e datas de criação. */
function semCampos(valor, campos) {
	if (Array.isArray(valor)) return valor.map((v) => semCampos(v, campos));
	if (valor && typeof valor === 'object') {
		return Object.fromEntries(Object.entries(valor).filter(([k]) => !campos.includes(k)).map(([k, v]) => [k, semCampos(v, campos)]));
	}
	return valor;
}

function diferenca(a, b, caminho = '') {
	if (JSON.stringify(a) === JSON.stringify(b)) return null;
	if (a && b && typeof a === 'object' && typeof b === 'object') {
		const chaves = new Set([...Object.keys(a), ...Object.keys(b)]);
		for (const k of chaves) {
			const d = diferenca(a[k], b[k], `${caminho}.${k}`);
			if (d) return d;
		}
	}
	return `${caminho || '(raiz)'}: nest=${JSON.stringify(a)?.slice(0, 160)} | next=${JSON.stringify(b)?.slice(0, 160)}`;
}

(async () => {
	criarUsuariosTeste();
	let falhas = 0;
	let total = 0;
	try {
		const tokensNest = {};
		const tokensNext = {};
		for (const [chave, l] of Object.entries(USUARIOS)) {
			tokensNest[chave] = await login(NEST, l);
			tokensNext[chave] = await login(NEXT, l);
		}
		const modulos = alvo === 'todos' ? Object.keys(casos) : alvo.split(',');
		for (const modulo of modulos) {
			const lista = typeof casos[modulo] === 'function' ? await casos[modulo]({ NEST, tokensNest }) : casos[modulo];
			if (!lista) throw new Error('módulo sem casos: ' + modulo);
			console.log(`\n### ${modulo}`);
			// Um "fluxo" é uma sequência executada em cada lado com estado próprio (ex.: criar -> editar -> remover).
			const passos = lista.flatMap((caso) =>
				caso.fluxo ? caso.fluxo.map((p, i) => ({ ...p, _fluxo: caso.nome, _novo: i === 0 })) : [caso],
			);
			const estados = { nest: {}, next: {} };
			for (const caso of passos) {
				total++;
				if (caso._novo) {
					estados.nest = {};
					estados.next = {};
				}
				// ORDEM=next-primeiro inverte a ordem (útil para lógicas que dependem do estado, como rodízio).
				let a, b;
				if (process.env.ORDEM === 'next-primeiro') {
					b = await chamar(NEXT, caso, tokensNext, 'next', estados.next);
					a = await chamar(NEST, caso, tokensNest, 'nest', estados.nest);
				} else {
					a = await chamar(NEST, caso, tokensNest, 'nest', estados.nest);
					b = await chamar(NEXT, caso, tokensNext, 'next', estados.next);
				}
				// comparar: 'status' compara só o status (resposta com id no texto, por exemplo).
				if (caso.comparar === 'status') a.corpo = b.corpo = null;
				const ignorar = caso.ignorar || [];
				a.corpo = semCampos(a.corpo, ignorar);
				b.corpo = semCampos(b.corpo, ignorar);
				const d = b.origem !== 'next' && !caso.semRota ? `atendido por ${b.origem} (rota não migrada)` : a.status !== b.status ? `status nest=${a.status} next=${b.status}` : a.tipo !== b.tipo ? `tipo nest=${a.tipo} next=${b.tipo}` : diferenca(a.corpo, b.corpo);
				if (d) falhas++;
				console.log(`${d ? 'DIFERENTE' : 'igual    '} ${caso.metodo || 'GET'} ${caso._fluxo ? '(' + caso._fluxo + ') ' : ''}${a.caminho} [${caso.como || 'anônimo'}] -> ${a.status}${d ? '\n    ' + d : ''}`);
			}
		}
	} finally {
		for (const comando of limpeza ?? []) sql(comando);
		removerUsuariosTeste();
	}
	console.log(`\n${total - falhas}/${total} iguais`);
	process.exit(falhas ? 1 : 0);
})().catch((e) => {
	console.error(e);
	try { removerUsuariosTeste(); } catch {}
	process.exit(2);
});
