// Gera <modulo>.routes.ts (packages/api) a partir de um controller NestJS, usando o compilador do TypeScript.
// Uso: node scripts/migracao/gerar-rotas.mjs <controller relativo a apps/backend/src> <destino relativo a packages/api/src> <NomeExport>
// Ex.: node scripts/migracao/gerar-rotas.mjs categoria/categoria.controller.ts categoria/categoria.routes.ts rotasCategoria
//
// Mapeia: @Get/@Post/@Patch/@Put/@Delete, @HttpCode, @Recurso/@AcessoLogado/@IsPublic,
// @Param('x'), @Query('x'), @Body(), @UsuarioAtual(). O corpo do método é copiado,
// trocando this.<service> por container().<chave>. @Res/@UploadedFile/@Req exigem ajuste manual.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const RAIZ = 'D:/www/trabalho/sisar-2026';
const [origemRel, destinoRel, nomeExport] = process.argv.slice(2);
const origem = path.join(RAIZ, 'apps/backend/src', origemRel);
const destino = path.join(RAIZ, 'packages/api/src', destinoRel);
const fonte = ts.createSourceFile(origem, fs.readFileSync(origem, 'utf8'), ts.ScriptTarget.Latest, true);

const STATUS = { OK: 200, CREATED: 201, ACCEPTED: 202, NO_CONTENT: 204 };
/** Chave do container a partir do tipo do service: CategoriaService -> categoria. */
const chave = (tipo) => ({ SGUService: 'sgu' })[tipo] ?? tipo.replace(/Service$/, '').replace(/^./, (c) => c.toLowerCase());

const decorators = (no) => (ts.canHaveDecorators(no) ? ts.getDecorators(no) ?? [] : []);
const nomeDec = (d) => d.expression.expression?.getText() ?? d.expression.getText();
const argsDec = (d) => d.expression.arguments ?? [];
const textoStr = (n) => (n && ts.isStringLiteralLike(n) ? n.text : undefined);

const avisos = [];
const saida = [];
let prefixo = '';
const servicos = {}; // nome da propriedade -> chave do container

ts.forEachChild(fonte, function visitar(no) {
	if (!ts.isClassDeclaration(no)) return;
	for (const d of decorators(no)) if (nomeDec(d) === 'Controller') prefixo = textoStr(argsDec(d)[0]) ?? '';
	const ctor = no.members.find(ts.isConstructorDeclaration);
	for (const p of ctor?.parameters ?? []) servicos[p.name.getText()] = chave(p.type.getText());

	for (const m of no.members.filter(ts.isMethodDeclaration)) {
		const decs = decorators(m);
		const verbo = decs.find((d) => ['Get', 'Post', 'Patch', 'Put', 'Delete'].includes(nomeDec(d)));
		if (!verbo) continue;
		const metodo = nomeDec(verbo).toLowerCase();
		const caminho = textoStr(argsDec(verbo)[0]) ?? '';
		const opcoes = [];
		for (const d of decs) {
			const n = nomeDec(d);
			if (n === 'HttpCode') {
				const a = argsDec(d)[0].getText();
				opcoes.push(`status: ${STATUS[a.replace('HttpStatus.', '')] ?? a}`);
			} else if (n === 'Recurso') {
				opcoes.push(`recursos: [${argsDec(d).map((a) => (ts.isStringLiteralLike(a) ? `'${a.text}'` : a.getText())).join(', ')}]`);
			} else if (n === 'AcessoLogado') opcoes.push(`recursos: ['*']`);
			else if (n === 'IsPublic') opcoes.push('publica: true');
			else if (['UseInterceptors', 'UsePipes', 'UseGuards'].includes(n)) avisos.push(`${m.name.getText()}: @${n} precisa de ajuste manual`);
		}

		const linhas = [];
		let precisaAsync = false;
		for (const p of m.parameters) {
			const dec = decorators(p)[0];
			const nomeP = p.name.getText();
			// No Nest params/query chegam como texto mesmo tipados como Date/enum: mantém o valor e só ajusta o tipo.
			const cast = p.type && !/^string(\s*\|\s*undefined)?$/.test(p.type.getText()) ? ' as any' : '';
			if (!dec) {
				avisos.push(`${m.name.getText()}: parâmetro sem decorator (${nomeP})`);
				continue;
			}
			const n = nomeDec(dec);
			const a = argsDec(dec);
			if (n === 'Param') linhas.push(`const ${nomeP} = ctx.params['${textoStr(a[0])}']${cast};`);
			else if (n === 'Query') {
				if (a[0]) linhas.push(`const ${nomeP} = ctx.query('${textoStr(a[0])}')${cast};`);
				else linhas.push(`const ${nomeP} = Object.fromEntries(new URL(ctx.req.url).searchParams);`);
			} else if (n === 'Body') {
				precisaAsync = true;
				linhas.push(a[0] ? `const ${nomeP} = (await ctx.corpo())['${textoStr(a[0])}'];` : `const ${nomeP} = await ctx.corpo();`);
			} else if (n === 'UsuarioAtual') linhas.push(`const ${nomeP} = ctx.usuario;`);
			else {
				avisos.push(`${m.name.getText()}: @${n} precisa de ajuste manual`);
				linhas.push(`const ${nomeP}: any = undefined; // TODO @${n}`);
			}
		}
		let corpo = m.body.getText().slice(1, -1); // sem as chaves
		for (const [prop, k] of Object.entries(servicos)) {
			corpo = corpo.replace(new RegExp(`this\\.${prop}\\b`, 'g'), `container().${k}`);
		}
		if (/\bthis\./.test(corpo)) avisos.push(`${m.name.getText()}: ainda usa this.`);
		if (/\bawait\b/.test(corpo) || m.modifiers?.some((x) => x.kind === ts.SyntaxKind.AsyncKeyword)) precisaAsync = true;
		// remove a indentação comum do corpo original e reindenta com tabs
		const linhasCorpo = corpo.split(/\r?\n/);
		while (linhasCorpo.length && !linhasCorpo[0].trim()) linhasCorpo.shift();
		while (linhasCorpo.length && !linhasCorpo[linhasCorpo.length - 1].trim()) linhasCorpo.pop();
		const recuo = Math.min(...linhasCorpo.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
		const corpoIndentado = [
			...linhas.map((l) => '\t\t\t' + l),
			...linhasCorpo.map((l) => (l.trim() ? '\t\t\t' + l.slice(recuo).replace(/^( {2})+/, (e) => '\t'.repeat(e.length / 2)) : '')),
		].join('\n');
		saida.push(
			`\t// ${m.name.getText()}\n\trota.${metodo}(\n\t\t'${caminho}',\n\t\t${precisaAsync ? 'async ' : ''}(ctx) => {\n${corpoIndentado}\n\t\t},\n\t\t{ ${opcoes.join(', ')} },\n\t),`,
		);
	}
});

const usaUndefined = saida.join('').includes('TODO');
const codigo = `/* Gerado a partir de apps/backend/src/${origemRel} (scripts/migracao/gerar-rotas.mjs) e revisado. */
import { container } from '${path.relative(path.dirname(destino), path.join(RAIZ, 'packages/api/src/container')).split(path.sep).join('/')}';
import { controller, rota } from '${path.relative(path.dirname(destino), path.join(RAIZ, 'packages/api/src/http/roteador')).split(path.sep).join('/')}';
${usaUndefined ? '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n' : ''}
/** Antigo controller @Controller('${prefixo}'). */
export const ${nomeExport} = controller('${prefixo}', [
${saida.join('\n')}
]);
`;
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, codigo.replace(/from '([^.][^']*)'/g, (m, p) => (p.startsWith('.') || p.startsWith('@') || !p.includes('/') ? m : `from './${p}'`)));
console.log(`gerado ${destinoRel} (${saida.length} rotas) — serviços: ${JSON.stringify(servicos)}`);
for (const a of avisos) console.log('   AVISO ' + a);
