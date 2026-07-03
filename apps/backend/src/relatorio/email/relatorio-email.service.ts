import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RelatorioExportacaoService } from '../exportacao/relatorio-exportacao.service';
import { EnviarRelatorioEmailDto } from '../dto/enviar-relatorio-email.dto';

@Injectable()
export class RelatorioEmailService {
  constructor(
    private readonly relatorioExportacaoService: RelatorioExportacaoService,
    private readonly emailService: EmailService,
  ) {}

  async enviar(
    tipoRelatorio: string,
    formato: string,
    dto: EnviarRelatorioEmailDto,
  ) {
    const arquivo = await this.relatorioExportacaoService.exportar(
      tipoRelatorio,
      formato,
      {
        dataInicial: dto.dataInicial,
        dataFinal: dto.dataFinal,
        anoInicial: dto.anoInicial,
        anoFinal: dto.anoFinal,
        periodo: dto.periodo,
      },
    );

    const assunto =
      dto.assunto ?? `Relatorio SISAR - ${tipoRelatorio}`;
    const mensagem =
      dto.mensagem ??
      'Segue em anexo o relatorio solicitado no SISAR.';

    const email = await this.emailService.enviarComAnexo({
      to: dto.destinatarios,
      subject: assunto,
      html: this.montarHtml(mensagem, arquivo.filename),
      text: `${mensagem}\n\nArquivo: ${arquivo.filename}`,
      attachments: [
        {
          filename: arquivo.filename,
          content: arquivo.buffer,
          contentType: arquivo.contentType,
        },
      ],
    });

    return {
      id: email?.id,
      filename: arquivo.filename,
      destinatarios: dto.destinatarios,
    };
  }

  private montarHtml(mensagem: string, filename: string) {
    return `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <p>${this.escapeHtml(mensagem).replace(/\n/g, '<br />')}</p>
        <p><strong>Arquivo:</strong> ${this.escapeHtml(filename)}</p>
        <p style="font-size: 12px; color: #6b7280;">
          Email enviado automaticamente pelo SISAR.
        </p>
      </div>
    `;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
