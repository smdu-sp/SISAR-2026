/**
 * Container manual de dependências (substitui a injeção do NestJS).
 * GERADO por scripts/migracao/gerar-container.mjs a partir dos construtores dos services.
 */
import { prisma } from './config/prisma';
import { AppService } from './app.service';
import { AlvaraTipoService } from './alvara-tipo/alvara-tipo.service';
import { SGUService } from './sgu/sgu.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { AuthService } from './auth/auth.service';
import { AvisosService } from './avisos/avisos.service';
import { CategoriaService } from './categoria/categoria.service';
import { MotivoInadmissaoService } from './motivo-inadmissao/motivo-inadmissao.service';
import { ParecerAdmissibilidadeService } from './parecer_admissibilidade/parecer_admissibilidade.service';
import { PedidoService } from './pedido/pedido.service';
import { PermissoesService } from './permissoes/permissoes.service';
import { PublicacoesService } from './publicacoes/publicacoes.service';
import { SubprefeituraService } from './subprefeitura/subprefeitura.service';
import { UnidadesService } from './unidades/unidades.service';

function criar() {
	const app = new AppService();
	const alvaraTipo = new AlvaraTipoService(prisma, app);
	const sgu = new SGUService();
	const usuarios = new UsuariosService(prisma, sgu, app);
	const auth = new AuthService(usuarios);
	const avisos = new AvisosService(prisma);
	const categoria = new CategoriaService(prisma, app);
	const motivoInadmissao = new MotivoInadmissaoService(prisma, app);
	const parecerAdmissibilidade = new ParecerAdmissibilidadeService(prisma, app);
	const pedido = new PedidoService(prisma, app);
	const permissoes = new PermissoesService(prisma);
	const publicacoes = new PublicacoesService(prisma, app);
	const subprefeitura = new SubprefeituraService(prisma, app);
	const unidades = new UnidadesService(prisma, app);

	// Equivalente ao OnModuleInit do NestJS.
	permissoes.onModuleInit().catch((e) => console.error('[permissoes] falha ao iniciar:', e));

	return { prisma, app, alvaraTipo, sgu, usuarios, auth, avisos, categoria, motivoInadmissao, parecerAdmissibilidade, pedido, permissoes, publicacoes, subprefeitura, unidades };
}

export type Container = ReturnType<typeof criar>;

// Cache no escopo do módulo (não em globalThis): na recarga a quente os services são recriados
// com o código novo. O PrismaClient continua único por processo (config/prisma.ts).
let instancia: Container | undefined;

export function container(): Container {
	if (!instancia) instancia = criar();
	return instancia;
}
