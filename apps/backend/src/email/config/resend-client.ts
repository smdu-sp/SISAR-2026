import { InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

export function createResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new InternalServerErrorException(
      'RESEND_API_KEY nao configurada.',
    );
  }
  return new Resend(apiKey);
}
