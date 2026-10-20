"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_client_1 = require("./config/resend-client");
let EmailService = class EmailService {
    configurado() {
        return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
    }
    async enviarComAnexo(params) {
        const from = process.env.RESEND_FROM;
        if (!from) {
            throw new common_1.InternalServerErrorException('RESEND_FROM nao configurado.');
        }
        const destinatarios = this.normalizarDestinatarios(params.to);
        const tamanhoMaximo = this.tamanhoMaximoAnexoBytes();
        const anexoGrande = params.attachments.find((attachment) => attachment.content.length > tamanhoMaximo);
        if (anexoGrande) {
            throw new common_1.BadRequestException(`O anexo ${anexoGrande.filename} excede o tamanho maximo permitido.`);
        }
        const resend = (0, resend_client_1.createResendClient)();
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
            throw new common_1.BadGatewayException({
                message: 'Erro ao enviar email pelo Resend.',
                error,
            });
        }
        return data;
    }
    normalizarDestinatarios(destinatarios) {
        const unicos = [...new Set(destinatarios.map((email) => email.trim()))]
            .filter(Boolean);
        if (unicos.length === 0) {
            throw new common_1.BadRequestException('Informe ao menos um destinatario.');
        }
        if (unicos.length > 50) {
            throw new common_1.BadRequestException('Informe no maximo 50 destinatarios.');
        }
        return unicos;
    }
    tamanhoMaximoAnexoBytes() {
        const maxMb = Number(process.env.EMAIL_ATTACHMENT_MAX_MB ?? 25);
        return maxMb * 1024 * 1024;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map