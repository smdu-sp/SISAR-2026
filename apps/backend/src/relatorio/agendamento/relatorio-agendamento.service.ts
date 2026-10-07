import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Frequencia_Envio,
  Prisma,
  Relatorio_Agendamento,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { RelatorioEmailService } from '../email/relatorio-email.service';
import { CreateRelatorioAgendamentoDto } from './dto/create-relatorio-agendamento.dto';
import { UpdateRelatorioAgendamentoDto } from './dto/update-relatorio-agendamento.dto';
import {
  calcularPeriodo,
  calcularProximoEnvio,
} from './relatorio-agendamento.utils';

type Origem = 'AGENDADO' | 'MANUAL';

@Injectable()
export class RelatorioAgendamentoService {
  private readonly logger = new Logger(RelatorioAgendamentoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly relatorioEmailService: RelatorioEmailService,
  ) {}

  statusEmail() {
    return { configurado: this.emailService.configurado() };
  }

  listar() {
    return this.prisma.relatorio_Agendamento.findMany({
      orderBy: { criado_em: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    const agendamento = await this.prisma.relatorio_Agendamento.findUnique({
      where: { id },
    });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    return agendamento;
  }

  historico(id: string, limite = 20) {
    return this.prisma.relatorio_Agendamento_Envio.findMany({
      where: { agendamento_id: id },
      orderBy: { executado_em: 'desc' },
      take: limite,
    });
  }

  async criar(dto: CreateRelatorioAgendamentoDto, criadoPorId?: string) {
    const dados = this.normalizar(dto);
    return this.prisma.relatorio_Agendamento.create({
      data: {
        ...dados,
        criado_por_id: criadoPorId ?? null,
        proximo_envio_em: dados.ativo
          ? calcularProximoEnvio(dados, new Date())
          : null,
      },
    });
  }

  async atualizar(id: string, dto: UpdateRelatorioAgendamentoDto) {
    const atual = await this.buscarPorId(id);
    const dados = this.normalizar({ ...atual, ...dto } as CreateRelatorioAgendamentoDto);
    return this.prisma.relatorio_Agendamento.update({
      where: { id },
      data: {
        ...dados,
        proximo_envio_em: dados.ativo
          ? calcularProximoEnvio(dados, new Date())
          : null,
      },
    });
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.relatorio_Agendamento.delete({ where: { id } });
    return { message: 'Agendamento removido com sucesso.' };
  }

  /** Dispara o envio agora, sem alterar a programação. */
  async executarAgora(id: string) {
    const agendamento = await this.buscarPorId(id);
    return this.executar(agendamento, 'MANUAL');
  }

  /**
   * Executa os agendamentos vencidos. Cada um é "reivindicado" de forma atômica
   * (avança o próximo envio antes de enviar), então duas instâncias do servidor
   * ou dois ciclos sobrepostos não enviam o mesmo relatório duas vezes.
   */
  async executarVencidos(agora = new Date()) {
    const vencidos = await this.prisma.relatorio_Agendamento.findMany({
      where: { ativo: true, proximo_envio_em: { lte: agora } },
    });

    for (const agendamento of vencidos) {
      const proximo = calcularProximoEnvio(agendamento, agora);
      const reivindicado = await this.prisma.relatorio_Agendamento.updateMany({
        where: { id: agendamento.id, proximo_envio_em: agendamento.proximo_envio_em },
        data: { proximo_envio_em: proximo },
      });
      if (reivindicado.count === 0) continue;
      await this.executar(agendamento, 'AGENDADO');
    }
  }

  private async executar(agendamento: Relatorio_Agendamento, origem: Origem) {
    const destinatarios = agendamento.destinatarios as string[];
    const formatos = [
      agendamento.formato_pdf ? 'pdf' : null,
      agendamento.formato_excel ? 'excel' : null,
    ].filter(Boolean) as string[];

    let arquivos: string[] | null = null;
    let erro: string | null = null;

    try {
      if (!this.emailService.configurado()) {
        throw new Error(
          'Envio de e-mail não configurado (RESEND_API_KEY / RESEND_FROM).',
        );
      }
      const filtros = calcularPeriodo(agendamento.periodo, new Date());
      const resultado = await this.relatorioEmailService.enviarMultiplos({
        tipoRelatorio: agendamento.tipo_relatorio,
        formatos,
        filtros,
        destinatarios,
        assunto: agendamento.assunto ?? undefined,
        mensagem: agendamento.mensagem ?? undefined,
      });
      arquivos = resultado.arquivos;
    } catch (e) {
      erro = e instanceof Error ? e.message : String(e);
      this.logger.error(
        `Falha ao enviar o agendamento "${agendamento.nome}" (${agendamento.id}): ${erro}`,
      );
    }

    await this.prisma.relatorio_Agendamento_Envio.create({
      data: {
        agendamento_id: agendamento.id,
        origem,
        sucesso: erro === null,
        destinatarios,
        arquivos: arquivos ?? Prisma.JsonNull,
        erro,
      },
    });
    if (erro === null) {
      await this.prisma.relatorio_Agendamento.update({
        where: { id: agendamento.id },
        data: { ultimo_envio_em: new Date() },
      });
    }

    return { sucesso: erro === null, arquivos, erro };
  }

  /** Aplica padrões e valida combinações que o class-validator não cobre. */
  private normalizar(dto: CreateRelatorioAgendamentoDto) {
    const formato_pdf = dto.formato_pdf ?? true;
    const formato_excel = dto.formato_excel ?? true;
    if (!formato_pdf && !formato_excel) {
      throw new BadRequestException('Selecione ao menos um formato (PDF ou Excel).');
    }
    if (dto.frequencia === Frequencia_Envio.MENSAL && !dto.dia_do_mes) {
      throw new BadRequestException('Informe o dia do mês para envio mensal.');
    }
    if (
      dto.frequencia === Frequencia_Envio.SEMANAL &&
      (dto.dia_da_semana === undefined || dto.dia_da_semana === null)
    ) {
      throw new BadRequestException('Informe o dia da semana para envio semanal.');
    }

    return {
      nome: dto.nome,
      tipo_relatorio: dto.tipo_relatorio,
      formato_pdf,
      formato_excel,
      destinatarios: [...new Set(dto.destinatarios.map((e) => e.trim().toLowerCase()))],
      assunto: dto.assunto ?? null,
      mensagem: dto.mensagem ?? null,
      frequencia: dto.frequencia,
      dia_do_mes: dto.frequencia === Frequencia_Envio.MENSAL ? dto.dia_do_mes : null,
      dia_da_semana: dto.frequencia === Frequencia_Envio.SEMANAL ? dto.dia_da_semana : null,
      hora: dto.hora ?? 8,
      minuto: dto.minuto ?? 0,
      periodo: dto.periodo ?? 'MES_ANTERIOR',
      ativo: dto.ativo ?? true,
    } as const;
  }
}
