/** Dependências do construtor de cada service (usado pelo substituto de @nestjs/testing nos testes). */
import { PrismaService } from './config/prisma';
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

void PrismaService;
export const dependencias = new Map<unknown, unknown[]>([
	[AppService, []],
	[AdmissibilidadeService, [PrismaService, AppService]],
	[AlvaraTipoService, [PrismaService, AppService]],
	[AnaliseService, [PrismaService]],
	[SGUService, []],
	[UsuariosService, [PrismaService, SGUService, AppService]],
	[AuthService, [UsuariosService]],
	[AvisosService, [PrismaService]],
	[CategoriaService, [PrismaService, AppService]],
	[DistribuicaoService, [PrismaService]],
	[EmailService, []],
	[FinalizacaoService, [PrismaService, AppService]],
	[InicialService, [PrismaService, AppService]],
	[MotivoInadmissaoService, [PrismaService, AppService]],
	[ParecerAdmissibilidadeService, [PrismaService, AppService]],
	[PedidoService, [PrismaService, AppService]],
	[PermissoesService, [PrismaService]],
	[PublicacoesService, [PrismaService, AppService]],
	[ReconsideracaoService, [PrismaService, InicialService]],
	[RelatorioService, [PrismaService]],
	[RelatorioRRService, [PrismaService]],
	[ArGraficoProgressaoMensalService, [PrismaService]],
	[RelatorioComplementarService, [PrismaService]],
	[RelatorioExportacaoService, [RelatorioService, RelatorioRRService, ArGraficoProgressaoMensalService, RelatorioComplementarService]],
	[RelatorioEmailService, [RelatorioExportacaoService, EmailService]],
	[RelatorioAgendamentoService, [PrismaService, EmailService, RelatorioEmailService]],
	[ReunioesService, [PrismaService]],
	[SubprefeituraService, [PrismaService, AppService]],
	[UnidadesService, [PrismaService, AppService]],
]);
