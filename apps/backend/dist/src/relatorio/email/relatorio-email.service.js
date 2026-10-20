"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioEmailService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../../email/email.service");
const relatorio_exportacao_service_1 = require("../exportacao/relatorio-exportacao.service");
let RelatorioEmailService = class RelatorioEmailService {
    constructor(relatorioExportacaoService, emailService) {
        this.relatorioExportacaoService = relatorioExportacaoService;
        this.emailService = emailService;
    }
    async enviar(tipoRelatorio, formato, dto) {
        const arquivo = await this.relatorioExportacaoService.exportar(tipoRelatorio, formato, {
            dataInicial: dto.dataInicial,
            dataFinal: dto.dataFinal,
            anoInicial: dto.anoInicial,
            anoFinal: dto.anoFinal,
            periodo: dto.periodo,
        });
        const assunto = dto.assunto ?? `Relatorio SISAR - ${tipoRelatorio}`;
        const mensagem = dto.mensagem ??
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
    async enviarMultiplos(params) {
        const arquivos = [];
        for (const formato of params.formatos) {
            arquivos.push(await this.relatorioExportacaoService.exportar(params.tipoRelatorio, formato, params.filtros));
        }
        const assunto = params.assunto ?? `Relatorio SISAR - ${params.tipoRelatorio}`;
        const mensagem = params.mensagem ?? 'Segue em anexo o relatorio solicitado no SISAR.';
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
    montarHtml(mensagem, filename) {
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
    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
exports.RelatorioEmailService = RelatorioEmailService;
exports.RelatorioEmailService = RelatorioEmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [relatorio_exportacao_service_1.RelatorioExportacaoService,
        email_service_1.EmailService])
], RelatorioEmailService);
//# sourceMappingURL=relatorio-email.service.js.map