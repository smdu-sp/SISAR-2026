// Porta um módulo inteiro do NestJS para @sisar/api: services/DTOs (port mecânico) + rotas (geradas do controller).
// Uso: node scripts/migracao/portar-modulo.mjs <pasta do módulo em apps/backend/src> <NomeExportDasRotas>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { portar } = require('./portar.cjs');

const RAIZ = 'D:/www/trabalho/sisar-2026';
const [modulo, nomeRotas] = process.argv.slice(2);
const base = path.join(RAIZ, 'apps/backend/src', modulo);

function arquivos(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) return e.name === 'tests' ? [] : arquivos(p);
		return e.name.endsWith('.ts') ? [p] : [];
	});
}

let controller;
for (const f of arquivos(base)) {
	const r = path.relative(path.join(RAIZ, 'apps/backend/src'), f).split(path.sep).join('/');
	if (r.endsWith('.module.ts') || r.endsWith('.spec.ts')) continue;
	if (r.endsWith('.controller.ts')) {
		controller = r;
		continue;
	}
	portar(r);
}
if (controller && nomeRotas) {
	execFileSync('node', [path.join(RAIZ, 'scripts/migracao/gerar-rotas.mjs'), controller, controller.replace('.controller.ts', '.routes.ts'), nomeRotas], {
		stdio: 'inherit',
	});
}
