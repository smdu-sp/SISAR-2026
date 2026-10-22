// Gera os clientes Prisma (SISAR e SGU). Roda no postinstall: o npm remove clientes
// gerados dentro de node_modules a cada instalação. Nunca falha a instalação: se o
// arquivo do engine estiver em uso (servidor rodando), avisa para gerar depois.
import { spawnSync } from 'node:child_process';

const esquemas = ['prisma/schema.prisma', 'sgu/schema.prisma'];
for (const schema of esquemas) {
	const r = spawnSync('npx', ['prisma', 'generate', `--schema=${schema}`], { stdio: 'inherit', shell: true });
	if (r.status !== 0) console.warn(`[gerar-prisma] falhou para ${schema}; rode "npm run prisma:generate" com os servidores parados.`);
}
