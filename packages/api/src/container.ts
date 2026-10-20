/**
 * Container manual de dependências (substitui a injeção do NestJS).
 * As instâncias são criadas uma vez por processo, na primeira requisição.
 */
import { prisma } from './config/prisma';
import { AppService } from './app.service';
import { SGUService } from './sgu/sgu.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { PermissoesService } from './permissoes/permissoes.service';
import { AuthService } from './auth/auth.service';

function criar() {
	const app = new AppService();
	const sgu = new SGUService();
	const usuarios = new UsuariosService(prisma, sgu, app);
	const permissoes = new PermissoesService(prisma);
	const auth = new AuthService(usuarios);

	// Equivalente ao OnModuleInit: banco sem matriz de permissões recebe o padrão.
	permissoes.onModuleInit().catch((e) => console.error('[permissoes] falha ao iniciar:', e));

	return { prisma, app, sgu, usuarios, permissoes, auth };
}

export type Container = ReturnType<typeof criar>;

// Cache no escopo do módulo (não em globalThis): na recarga a quente os services são recriados
// com o código novo. O PrismaClient continua único por processo (config/prisma.ts).
let instancia: Container | undefined;

export function container(): Container {
	if (!instancia) instancia = criar();
	return instancia;
}
