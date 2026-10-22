/**
 * Container manual de dependências (substitui a injeção do NestJS).
 * Ao criar um service novo: instancie-o aqui (na ordem das dependências) e registre-o em dependencias.ts.
 */
import { prisma } from './config/prisma';
import { AppService } from './app.service';
import { AdmissibilidadeService } from './admissibilidade/admissibilidade.service';
import { AlvaraTipoService } from './alvara-tipo/alvara-tipo.service';
import { AnaliseService } from './analise/analise.service';
import { SGUService } from './sgu/sgu.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { AuthService } from './auth/auth.service';
import { AvisosService } from './avisos/avisos.service';
import { CategoriaService } from './categoria/categoria.service';
import { DistribuicaoService } from './distribuicao/distribuicao.service';
import { EmailService } from './email/email.service';
import { FinalizacaoService } from './finalizacao/finalizacao.service';
import { InicialService } from './inicial/inicial.service';
import { MotivoInadmissaoService } from './motivo-inadmissao/motivo-inadmissao.service';
import { ParecerAdmissibilidadeService } from './parecer_admissibilidade/parecer_admissibilidade.service';
import { PedidoService } from './pedido/pedido.service';
import { PermissoesService } from './permissoes/permissoes.service';
import { PublicacoesService } from './publicacoes/publicacoes.service';
import { ReconsideracaoService } from './reconsideracao/reconsideracao.service';
import { RelatorioService } from './relatorio/relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from './relatorio/relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from './relatorio/ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from './relatorio/relatorio-complementar/relatorio-complementar.service';
import { RelatorioExportacaoService } from './relatorio/exportacao/relatorio-exportacao.service';
import { RelatorioEmailService } from './relatorio/email/relatorio-email.service';
import { RelatorioAgendamentoService } from './relatorio/agendamento/relatorio-agendamento.service';
import { ReunioesService } from './reunioes/reunioes.service';
import { SubprefeituraService } from './subprefeitura/subprefeitura.service';
import { UnidadesService } from './unidades/unidades.service';
function criar() {
    const app = new AppService();
    const admissibilidade = new AdmissibilidadeService(prisma, app);
    const alvaraTipo = new AlvaraTipoService(prisma, app);
    const analise = new AnaliseService(prisma);
    const sgu = new SGUService();
    const usuarios = new UsuariosService(prisma, sgu, app);
    const auth = new AuthService(usuarios);
    const avisos = new AvisosService(prisma);
    const categoria = new CategoriaService(prisma, app);
    const distribuicao = new DistribuicaoService(prisma);
    const email = new EmailService();
    const finalizacao = new FinalizacaoService(prisma, app);
    const inicial = new InicialService(prisma, app);
    const motivoInadmissao = new MotivoInadmissaoService(prisma, app);
    const parecerAdmissibilidade = new ParecerAdmissibilidadeService(prisma, app);
    const pedido = new PedidoService(prisma, app);
    const permissoes = new PermissoesService(prisma);
    const publicacoes = new PublicacoesService(prisma, app);
    const reconsideracao = new ReconsideracaoService(prisma, inicial);
    const relatorio = new RelatorioService(prisma);
    const relatorioRR = new RelatorioRRService(prisma);
    const arGraficoProgressaoMensal = new ArGraficoProgressaoMensalService(prisma);
    const relatorioComplementar = new RelatorioComplementarService(prisma);
    const relatorioExportacao = new RelatorioExportacaoService(relatorio, relatorioRR, arGraficoProgressaoMensal, relatorioComplementar);
    const relatorioEmail = new RelatorioEmailService(relatorioExportacao, email);
    const relatorioAgendamento = new RelatorioAgendamentoService(prisma, email, relatorioEmail);
    const reunioes = new ReunioesService(prisma);
    const subprefeitura = new SubprefeituraService(prisma, app);
    const unidades = new UnidadesService(prisma, app);
    // Equivalente ao OnModuleInit do NestJS.
    permissoes.onModuleInit().catch((e) => console.error('[permissoes] falha ao iniciar:', e));
    return { prisma, app, admissibilidade, alvaraTipo, analise, sgu, usuarios, auth, avisos, categoria, distribuicao, email, finalizacao, inicial, motivoInadmissao, parecerAdmissibilidade, pedido, permissoes, publicacoes, reconsideracao, relatorio, relatorioRR, arGraficoProgressaoMensal, relatorioComplementar, relatorioExportacao, relatorioEmail, relatorioAgendamento, reunioes, subprefeitura, unidades };
}
// Cache no escopo do módulo (não em globalThis): na recarga a quente os services são recriados
// com o código novo. O PrismaClient continua único por processo (config/prisma.ts).
let instancia;
export function container() {
    if (!instancia)
        instancia = criar();
    return instancia;
}
