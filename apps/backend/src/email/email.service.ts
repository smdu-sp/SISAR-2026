import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createResendClient } from './config/resend-client';

interface EnviarEmailComAnexoParams {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  attachments: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  async enviarComAnexo(params: EnviarEmailComAnexoParams) {
    const from = process.env.RESEND_FROM;
    if (!from) {
      throw new InternalServerErrorException('RESEND_FROM nao configurado.');
    }

    const destinatarios = this.normalizarDestinatarios(params.to);
    const tamanhoMaximo = this.tamanhoMaximoAnexoBytes();
    const anexoGrande = params.attachments.find(
      (attachment) => attachment.content.length > tamanhoMaximo,
    );
    if (anexoGrande) {
      throw new BadRequestException(
        `O anexo ${anexoGrande.filename} excede o tamanho maximo permitido.`,
      );
    }

    const resend = createResendClient();
    const { data, error } = await resend.emails.send({
      from,
      to: destinatarios,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    });

    if (error) {
      throw new BadGatewayException({
        message: 'Erro ao enviar email pelo Resend.',
        error,
      });
    }

    return data;
  }

  private normalizarDestinatarios(destinatarios: string[]) {
    const unicos = [...new Set(destinatarios.map((email) => email.trim()))]
      .filter(Boolean);
    if (unicos.length === 0) {
      throw new BadRequestException('Informe ao menos um destinatario.');
    }
    if (unicos.length > 50) {
      throw new BadRequestException('Informe no maximo 50 destinatarios.');
    }
    return unicos;
  }

  private tamanhoMaximoAnexoBytes() {
    const maxMb = Number(process.env.EMAIL_ATTACHMENT_MAX_MB ?? 25);
    return maxMb * 1024 * 1024;
  }
}
