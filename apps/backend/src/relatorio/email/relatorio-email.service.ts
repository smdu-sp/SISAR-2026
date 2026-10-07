import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RelatorioExportacaoService } from '../exportacao/relatorio-exportacao.service';
import { EnviarRelatorioEmailDto } from '../dto/enviar-relatorio-email.dto';

interface ExportarFiltros {
  dataInicial?: string;
  dataFinal?: string;
  anoInicial?: string;
  anoFinal?: string;
  periodo?: string;
}

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

  /** Gera o relatório em vários formatos e envia tudo em um único e-mail. */
  async enviarMultiplos(params: {
    tipoRelatorio: string;
    formatos: string[];
    filtros: ExportarFiltros;
    destinatarios: string[];
    assunto?: string;
    mensagem?: string;
  }) {
    const arquivos = [];
    for (const formato of params.formatos) {
      arquivos.push(
        await this.relatorioExportacaoService.exportar(
          params.tipoRelatorio,
          formato,
          params.filtros,
        ),
      );
    }

    const assunto =
      params.assunto ?? `Relatorio SISAR - ${params.tipoRelatorio}`;
    const mensagem =
      params.mensagem ?? 'Segue em anexo o relatorio solicitado no SISAR.';
    const nomes = arquivos.map((a) => a.filename);

    const email = await this.emailService.enviarComAnexo({
      to: params.destinatarios,
      subject: assunto,
      html: this.montarHtml(mensagem, nomes.join(', ')),
      text: `${mensagem}\n\nArquivos: ${nomes.join(', ')}`,
      attachments: arquivos.map((a) => ({
        filename: a.filename,
        content: a.buffer,
        contentType: a.contentType,
      })),
    });

    return { id: email?.id, arquivos: nomes };
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
