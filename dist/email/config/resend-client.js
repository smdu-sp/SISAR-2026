import { InternalServerErrorException } from '../../http/errors';
import { Resend } from 'resend';
export function createResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new InternalServerErrorException('RESEND_API_KEY nao configurada.');
    }
    return new Resend(apiKey);
}
