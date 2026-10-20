// Port mecânico de arquivos do NestJS (apps/backend/src) para @sisar/api (packages/api/src).
// Uso: node scripts/migracao/portar.cjs <origem relativa a apps/backend/src> [destino relativo a packages/api/src]
const fs = require('fs');
const path = require('path');

const RAIZ = 'D:/www/trabalho/sisar-2026/apps';
const EXCECOES = new Set([
	'BadRequestException', 'UnauthorizedException', 'ForbiddenException', 'NotFoundException',
	'ConflictException', 'InternalServerErrorException', 'BadGatewayException', 'HttpException',
]);

/** Remove chamadas de decorator com parênteses balanceados (respeitando strings). */
function removerDecorators(src, filtro) {
	let saida = '';
	let i = 0;
	while (i < src.length) {
		const m = /@([A-Za-z_]\w*)\s*\(/y;
		m.lastIndex = i;
		const achou = src[i] === '@' && m.exec(src);
		if (achou && filtro(achou[1])) {
			let j = m.lastIndex; // depois do "("
			let prof = 1;
			let aspas = null;
			while (j < src.length && prof > 0) {
				const c = src[j];
				if (aspas) {
					if (c === '\\') j++;
					else if (c === aspas) aspas = null;
				} else if (c === '"' || c === "'" || c === '`') aspas = c;
				else if (c === '(') prof++;
				else if (c === ')') prof--;
				j++;
			}
			// remove também espaços/quebra de linha seguintes, e a indentação anterior
			while (j < src.length && (src[j] === ' ' || src[j] === '\t')) j++;
			if (src[j] === '\r') j++;
			if (src[j] === '\n') j++;
			saida = saida.replace(/[ \t]*$/, '');
			i = j;
			continue;
		}
		saida += src[i];
		i++;
	}
	return saida;
}

function portar(origemRel, destinoRel) {
	const origem = path.join(RAIZ, 'backend/src', origemRel);
	const destino = path.join('D:/www/trabalho/sisar-2026/packages/api/src', destinoRel || origemRel);
	let s = fs.readFileSync(origem, 'utf8');
	const avisos = [];

	// imports do Nest
	s = s.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@nestjs\/common['"];?[ \t]*\r?\n/g, (_, nomes) => {
		const usados = nomes.split(',').map((n) => n.trim()).filter(Boolean);
		const exc = usados.filter((n) => EXCECOES.has(n));
		const outros = usados.filter((n) => !EXCECOES.has(n) && !['Injectable', 'Global', 'OnModuleInit', 'Logger'].includes(n));
		if (outros.length) avisos.push('@nestjs/common não portado: ' + outros.join(', '));
		let linhas = '';
		if (exc.length) linhas += `import { ${exc.join(', ')} } from '@/server/http/errors';\n`;
		if (usados.includes('Logger')) linhas += `import { Logger } from '@/server/http/logger';\n`;
		return linhas;
	});
	s = s.replace(/import\s*\{[^}]*\}\s*from\s*['"]@nestjs\/(swagger|mapped-types)['"];?[ \t]*\r?\n/g, '');
	s = s.replace(/\bextends PartialType\(\s*(\w+),?\s*\)\s*\{\s*\}/g, (m, base) => {
		avisos.push(`PartialType(${base}) virou type`);
		return `__PARTIAL__${base}`;
	});
	s = s.replace(/export class (\w+) __PARTIAL__(\w+)/g, 'export type $1 = Partial<$2>;');

	// decorators sem efeito fora do Nest
	s = removerDecorators(s, (nome) => /^Api/.test(nome) || nome === 'Injectable' || nome === 'Global');
	s = s.replace(/\bimplements OnModuleInit\b\s*/g, '');

	// caminhos
	s = s.replace(/from ['"]@nestjs\/testing['"]/g, "from '@/server/testes/nest-testing'");
	s = s.replace(/from ["']src\/([^"']+)["']/g, "from 'src/$1'");
	s = s.replace(/from 'src\/prisma\/prisma\.service'/g, "from '@/server/config/prisma'");
	s = s.replace(/from 'src\/([^']+)'/g, "from '@/server/$1'");
	s = s.replace(/from '\.\.\/\.\.\/prisma\/prisma\.service'/g, "from '@/server/config/prisma'");

	for (const resto of s.match(/@nestjs\/[\w-]+|@(Cron|Interval|Timeout)\(/g) || []) avisos.push('revisar: ' + resto);
	fs.mkdirSync(path.dirname(destino), { recursive: true });
	s = s.replace(/from '@\/server\/([^']+)'/g, (_, alvo) => { let r = path.relative(path.dirname(destino), path.join('D:/www/trabalho/sisar-2026/packages/api/src', alvo)).split(path.sep).join('/'); if (!r.startsWith('.')) r = './' + r; return "from '" + r + "'"; });
	fs.writeFileSync(destino, s);
	console.log('portado', origemRel, '->', destinoRel || origemRel, avisos.length ? '\n   ' + avisos.join('\n   ') : '');
}

const [origem, destino] = process.argv.slice(2);
if (require.main === module && origem) portar(origem, destino);
module.exports = { portar };
