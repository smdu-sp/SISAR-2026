import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RelatorioAgendamentoService } from './relatorio-agendamento.service';

@Injectable()
export class RelatorioAgendamentoScheduler {
  private readonly logger = new Logger(RelatorioAgendamentoScheduler.name);
  private executando = false;

  constructor(private readonly agendamentoService: RelatorioAgendamentoService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async verificarVencidos() {
    if (this.executando) return;
    this.executando = true;
    try {
      await this.agendamentoService.executarVencidos();
    } catch (e) {
      this.logger.error(
        `Erro ao processar agendamentos de relatórios: ${e instanceof Error ? e.message : e}`,
      );
    } finally {
      this.executando = false;
    }
  }
}
