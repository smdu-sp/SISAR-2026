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
var RelatorioAgendamentoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioAgendamentoService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const email_service_1 = require("../../email/email.service");
const relatorio_email_service_1 = require("../email/relatorio-email.service");
const relatorio_agendamento_utils_1 = require("./relatorio-agendamento.utils");
let RelatorioAgendamentoService = RelatorioAgendamentoService_1 = class RelatorioAgendamentoService {
    constructor(prisma, emailService, relatorioEmailService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.relatorioEmailService = relatorioEmailService;
        this.logger = new common_1.Logger(RelatorioAgendamentoService_1.name);
    }
    statusEmail() {
        return { configurado: this.emailService.configurado() };
    }
    listar() {
        return this.prisma.relatorio_Agendamento.findMany({
            orderBy: { criado_em: 'desc' },
        });
    }
    async buscarPorId(id) {
        const agendamento = await this.prisma.relatorio_Agendamento.findUnique({
            where: { id },
        });
        if (!agendamento)
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        return agendamento;
    }
    historico(id, limite = 20) {
        return this.prisma.relatorio_Agendamento_Envio.findMany({
            where: { agendamento_id: id },
            orderBy: { executado_em: 'desc' },
            take: limite,
        });
    }
    async criar(dto, criadoPorId) {
        const dados = this.normalizar(dto);
        return this.prisma.relatorio_Agendamento.create({
            data: {
                ...dados,
                criado_por_id: criadoPorId ?? null,
                proximo_envio_em: dados.ativo
                    ? (0, relatorio_agendamento_utils_1.calcularProximoEnvio)(dados, new Date())
                    : null,
            },
        });
    }
    async atualizar(id, dto) {
        const atual = await this.buscarPorId(id);
        const dados = this.normalizar({ ...atual, ...dto });
        return this.prisma.relatorio_Agendamento.update({
            where: { id },
            data: {
                ...dados,
                proximo_envio_em: dados.ativo
                    ? (0, relatorio_agendamento_utils_1.calcularProximoEnvio)(dados, new Date())
                    : null,
            },
        });
    }
    async remover(id) {
        await this.buscarPorId(id);
        await this.prisma.relatorio_Agendamento.delete({ where: { id } });
        return { message: 'Agendamento removido com sucesso.' };
    }
    async executarAgora(id) {
        const agendamento = await this.buscarPorId(id);
        return this.executar(agendamento, 'MANUAL');
    }
    async executarVencidos(agora = new Date()) {
        const vencidos = await this.prisma.relatorio_Agendamento.findMany({
            where: { ativo: true, proximo_envio_em: { lte: agora } },
        });
        for (const agendamento of vencidos) {
            const proximo = (0, relatorio_agendamento_utils_1.calcularProximoEnvio)(agendamento, agora);
            const reivindicado = await this.prisma.relatorio_Agendamento.updateMany({
                where: { id: agendamento.id, proximo_envio_em: agendamento.proximo_envio_em },
                data: { proximo_envio_em: proximo },
            });
            if (reivindicado.count === 0)
                continue;
            await this.executar(agendamento, 'AGENDADO');
        }
    }
    async executar(agendamento, origem) {
        const destinatarios = agendamento.destinatarios;
        const formatos = [
            agendamento.formato_pdf ? 'pdf' : null,
            agendamento.formato_excel ? 'excel' : null,
        ].filter(Boolean);
        let arquivos = null;
        let erro = null;
        try {
            if (!this.emailService.configurado()) {
                throw new Error('Envio de e-mail não configurado (RESEND_API_KEY / RESEND_FROM).');
            }
            const filtros = (0, relatorio_agendamento_utils_1.calcularPeriodo)(agendamento.periodo, new Date());
            const resultado = await this.relatorioEmailService.enviarMultiplos({
                tipoRelatorio: agendamento.tipo_relatorio,
                formatos,
                filtros,
                destinatarios,
                assunto: agendamento.assunto ?? undefined,
                mensagem: agendamento.mensagem ?? undefined,
            });
            arquivos = resultado.arquivos;
        }
        catch (e) {
            erro = e instanceof Error ? e.message : String(e);
            this.logger.error(`Falha ao enviar o agendamento "${agendamento.nome}" (${agendamento.id}): ${erro}`);
        }
        await this.prisma.relatorio_Agendamento_Envio.create({
            data: {
                agendamento_id: agendamento.id,
                origem,
                sucesso: erro === null,
                destinatarios,
                arquivos: arquivos ?? client_1.Prisma.JsonNull,
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
    normalizar(dto) {
        const formato_pdf = dto.formato_pdf ?? true;
        const formato_excel = dto.formato_excel ?? true;
        if (!formato_pdf && !formato_excel) {
            throw new common_1.BadRequestException('Selecione ao menos um formato (PDF ou Excel).');
        }
        if (dto.frequencia === client_1.Frequencia_Envio.MENSAL && !dto.dia_do_mes) {
            throw new common_1.BadRequestException('Informe o dia do mês para envio mensal.');
        }
        if (dto.frequencia === client_1.Frequencia_Envio.SEMANAL &&
            (dto.dia_da_semana === undefined || dto.dia_da_semana === null)) {
            throw new common_1.BadRequestException('Informe o dia da semana para envio semanal.');
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
            dia_do_mes: dto.frequencia === client_1.Frequencia_Envio.MENSAL ? dto.dia_do_mes : null,
            dia_da_semana: dto.frequencia === client_1.Frequencia_Envio.SEMANAL ? dto.dia_da_semana : null,
            hora: dto.hora ?? 8,
            minuto: dto.minuto ?? 0,
            periodo: dto.periodo ?? 'MES_ANTERIOR',
            ativo: dto.ativo ?? true,
        };
    }
};
exports.RelatorioAgendamentoService = RelatorioAgendamentoService;
exports.RelatorioAgendamentoService = RelatorioAgendamentoService = RelatorioAgendamentoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        relatorio_email_service_1.RelatorioEmailService])
], RelatorioAgendamentoService);
//# sourceMappingURL=relatorio-agendamento.service.js.map