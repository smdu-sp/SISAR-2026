import { Module } from '@nestjs/common';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from './relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from './ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from './relatorio-complementar/relatorio-complementar.service';
import { RelatorioExportacaoService } from './exportacao/relatorio-exportacao.service';
import { EmailModule } from 'src/email/email.module';
import { RelatorioEmailService } from './email/relatorio-email.service';

@Module({
  imports: [EmailModule],
  controllers: [RelatorioController],
  providers: [
    RelatorioService,
    RelatorioRRService,
    ArGraficoProgressaoMensalService,
    RelatorioComplementarService,
    RelatorioExportacaoService,
    RelatorioEmailService,
  ],
})
export class RelatorioModule {}
