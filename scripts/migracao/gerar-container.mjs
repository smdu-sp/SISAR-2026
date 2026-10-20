// Gera packages/api/src/container.ts e packages/api/src/rotas.ts a partir dos services/rotas portados.
// - container: instancia cada *Service na ordem das dependências do construtor (substitui a injeção do Nest).
// - rotas: junta todos os "export const rotasX" dos arquivos *.routes.ts.
// Uso: node scripts/migracao/gerar-container.mjs
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const SRC = 'D:/www/trabalho/sisar-2026/packages/api/src';
const ESPECIAIS = { PrismaService: 'prisma', SGUService: 'sgu' };

function arquivos(dir, filtro) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) return e.name === 'tests' ? [] : arquivos(p, filtro);
		return filtro(e.name) ? [p] : [];
	});
}
const rel = (de, para) => {
	let r = path.relative(path.dirname(de), para).split(path.sep).join('/').replace(/\.ts$/, '');
	return r.startsWith('.') ? r : './' + r;
};
const chave = (tipo) => ESPECIAIS[tipo] ?? tipo.replace(/Service$/, '').replace(/^./, (c) => c.toLowerCase());

// --- services
const servicos = [];
for (const f of arquivos(SRC, (n) => n.endsWith('.service.ts'))) {
	const fonte = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
	ts.forEachChild(fonte, (no) => {
		if (!ts.isClassDeclaration(no) || !no.name || !no.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return;
		const ctor = no.members.find(ts.isConstructorDeclaration);
		const deps = (ctor?.parameters ?? []).map((p) => p.type?.getText());
		const temInit = no.members.some((m) => ts.isMethodDeclaration(m) && m.name.getText() === 'onModuleInit');
		servicos.push({ classe: no.name.text, arquivo: f, deps, temInit });
	});
}

const porClasse = Object.fromEntries(servicos.map((s) => [s.classe, s]));
const ordem = [];
const visitando = new Set();
function visitar(classe, cadeia = []) {
	if (ordem.includes(classe) || classe === 'PrismaService') return;
	const s = porClasse[classe];
	if (!s) throw new Error(`Dependência não portada: ${classe} (de ${cadeia.join(' -> ')})`);
	if (visitando.has(classe)) throw new Error('Dependência circular: ' + [...cadeia, classe].join(' -> '));
	visitando.add(classe);
	for (const d of s.deps) visitar(d, [...cadeia, classe]);
	visitando.delete(classe);
	ordem.push(classe);
}
for (const s of servicos) visitar(s.classe);

const destinoContainer = path.join(SRC, 'container.ts');
const linhasImport = ordem.map((c) => `import { ${c} } from '${rel(destinoContainer, porClasse[c].arquivo)}';`);
const linhasCriar = ordem.map((c) => `\tconst ${chave(c)} = new ${c}(${porClasse[c].deps.map(chave).join(', ')});`);
const inits = ordem.filter((c) => porClasse[c].temInit).map(
	(c) => `\t${chave(c)}.onModuleInit().catch((e) => console.error('[${chave(c)}] falha ao iniciar:', e));`,
);
fs.writeFileSync(
	destinoContainer,
	`/**
 * Container manual de dependências (substitui a injeção do NestJS).
 * GERADO por scripts/migracao/gerar-container.mjs a partir dos construtores dos services.
 */
import { prisma } from './config/prisma';
${linhasImport.join('\n')}

function criar() {
${linhasCriar.join('\n')}
${inits.length ? '\n\t// Equivalente ao OnModuleInit do NestJS.\n' + inits.join('\n') + '\n' : ''}
	return { prisma, ${ordem.map(chave).join(', ')} };
}

export type Container = ReturnType<typeof criar>;

// Cache no escopo do módulo (não em globalThis): na recarga a quente os services são recriados
// com o código novo. O PrismaClient continua único por processo (config/prisma.ts).
let instancia: Container | undefined;

export function container(): Container {
	if (!instancia) instancia = criar();
	return instancia;
}
`,
);

// --- registro de dependências (usado pelo substituto de @nestjs/testing nos testes)
const destinoDeps = path.join(SRC, 'dependencias.ts');
fs.writeFileSync(
	destinoDeps,
	`/** Dependências do construtor de cada service. GERADO por scripts/migracao/gerar-container.mjs. */
import { PrismaService } from './config/prisma';
${ordem.map((c) => `import { ${c} } from '${rel(destinoDeps, porClasse[c].arquivo)}';`).join('\n')}

void PrismaService;
export const dependencias = new Map<unknown, unknown[]>([
${ordem.map((c) => `\t[${c}, [${porClasse[c].deps.join(', ')}]],`).join('\n')}
]);
`,
);

// --- rotas
const destinoRotas = path.join(SRC, 'rotas.ts');
const rotas = [];
for (const f of arquivos(SRC, (n) => n.endsWith('.routes.ts')).sort()) {
	for (const m of fs.readFileSync(f, 'utf8').matchAll(/export const (rotas\w+)/g)) rotas.push({ nome: m[1], arquivo: f });
}
fs.writeFileSync(
	destinoRotas,
	`/** Rotas migradas. GERADO por scripts/migracao/gerar-container.mjs. */
import type { RotaCompilada } from './http/tipos';
${rotas.map((r) => `import { ${r.nome} } from '${rel(destinoRotas, r.arquivo)}';`).join('\n')}

export const rotasMigradas: RotaCompilada[] = [
${rotas.map((r) => `\t...${r.nome},`).join('\n')}
];
`,
);

console.log(`container: ${ordem.length} services (${ordem.map(chave).join(', ')})`);
console.log(`rotas: ${rotas.map((r) => r.nome).join(', ')}`);
