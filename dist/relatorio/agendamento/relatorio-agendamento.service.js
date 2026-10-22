import { BadRequestException, NotFoundException } from '../../http/errors';
import { Logger } from '../../http/logger';
import { Frequencia_Envio, Prisma, } from '@prisma/client';
import { calcularPeriodo, calcularProximoEnvio, } from './relatorio-agendamento.utils';
export class RelatorioAgendamentoService {
    constructor(prisma, emailService, relatorioEmailService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.relatorioEmailService = relatorioEmailService;
        this.logger = new Logger(RelatorioAgendamentoService.name);
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
            throw new NotFoundException('Agendamento não encontrado.');
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
                    ? calcularProximoEnvio(dados, new Date())
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
                    ? calcularProximoEnvio(dados, new Date())
                    : null,
            },
        });
    }
    async remover(id) {
        await this.buscarPorId(id);
        await this.prisma.relatorio_Agendamento.delete({ where: { id } });
        return { message: 'Agendamento removido com sucesso.' };
    }
    /** Dispara o envio agora, sem alterar a programação. */
    async executarAgora(id) {
        const agendamento = await this.buscarPorId(id);
        return this.executar(agendamento, 'MANUAL');
    }
    /**
     * Executa os agendamentos vencidos. Cada um é "reivindicado" de forma atômica
     * (avança o próximo envio antes de enviar), então duas instâncias do servidor
     * ou dois ciclos sobrepostos não enviam o mesmo relatório duas vezes.
     */
    async executarVencidos(agora = new Date()) {
        const vencidos = await this.prisma.relatorio_Agendamento.findMany({
            where: { ativo: true, proximo_envio_em: { lte: agora } },
        });
        for (const agendamento of vencidos) {
            const proximo = calcularProximoEnvio(agendamento, agora);
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
            const filtros = calcularPeriodo(agendamento.periodo, new Date());
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
                arquivos: arquivos ?? Prisma.JsonNull,
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
    /** Aplica padrões e valida combinações que o class-validator não cobre. */
    normalizar(dto) {
        const formato_pdf = dto.formato_pdf ?? true;
        const formato_excel = dto.formato_excel ?? true;
        if (!formato_pdf && !formato_excel) {
            throw new BadRequestException('Selecione ao menos um formato (PDF ou Excel).');
        }
        if (dto.frequencia === Frequencia_Envio.MENSAL && !dto.dia_do_mes) {
            throw new BadRequestException('Informe o dia do mês para envio mensal.');
        }
        if (dto.frequencia === Frequencia_Envio.SEMANAL &&
            (dto.dia_da_semana === undefined || dto.dia_da_semana === null)) {
            throw new BadRequestException('Informe o dia da semana para envio semanal.');
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
            dia_do_mes: dto.frequencia === Frequencia_Envio.MENSAL ? dto.dia_do_mes : null,
            dia_da_semana: dto.frequencia === Frequencia_Envio.SEMANAL ? dto.dia_da_semana : null,
            hora: dto.hora ?? 8,
            minuto: dto.minuto ?? 0,
            periodo: dto.periodo ?? 'MES_ANTERIOR',
            ativo: dto.ativo ?? true,
        };
    }
}
