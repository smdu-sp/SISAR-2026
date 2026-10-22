import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma';
import { EmailService } from '../../email/email.service';
import { RelatorioEmailService } from '../email/relatorio-email.service';
import { CreateRelatorioAgendamentoDto } from './dto/create-relatorio-agendamento.dto';
import { UpdateRelatorioAgendamentoDto } from './dto/update-relatorio-agendamento.dto';
export declare class RelatorioAgendamentoService {
    private readonly prisma;
    private readonly emailService;
    private readonly relatorioEmailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, relatorioEmailService: RelatorioEmailService);
    statusEmail(): {
        configurado: boolean;
    };
    listar(): Prisma.PrismaPromise<{
        criado_em: Date;
        alterado_em: Date;
        id: string;
        nome: string;
        periodo: import(".prisma/client").$Enums.Periodo_Relatorio;
        destinatarios: Prisma.JsonValue;
        assunto: string | null;
        mensagem: string | null;
        tipo_relatorio: string;
        formato_pdf: boolean;
        formato_excel: boolean;
        frequencia: import(".prisma/client").$Enums.Frequencia_Envio;
        dia_do_mes: number | null;
        dia_da_semana: number | null;
        hora: number;
        minuto: number;
        ativo: boolean;
        proximo_envio_em: Date | null;
        ultimo_envio_em: Date | null;
        criado_por_id: string | null;
    }[]>;
    buscarPorId(id: string): Promise<{
        criado_em: Date;
        alterado_em: Date;
        id: string;
        nome: string;
        periodo: import(".prisma/client").$Enums.Periodo_Relatorio;
        destinatarios: Prisma.JsonValue;
        assunto: string | null;
        mensagem: string | null;
        tipo_relatorio: string;
        formato_pdf: boolean;
        formato_excel: boolean;
        frequencia: import(".prisma/client").$Enums.Frequencia_Envio;
        dia_do_mes: number | null;
        dia_da_semana: number | null;
        hora: number;
        minuto: number;
        ativo: boolean;
        proximo_envio_em: Date | null;
        ultimo_envio_em: Date | null;
        criado_por_id: string | null;
    }>;
    historico(id: string, limite?: number): Prisma.PrismaPromise<{
        id: string;
        erro: string | null;
        destinatarios: Prisma.JsonValue;
        agendamento_id: string;
        executado_em: Date;
        origem: string;
        sucesso: boolean;
        arquivos: Prisma.JsonValue | null;
    }[]>;
    criar(dto: CreateRelatorioAgendamentoDto, criadoPorId?: string): Promise<{
        criado_em: Date;
        alterado_em: Date;
        id: string;
        nome: string;
        periodo: import(".prisma/client").$Enums.Periodo_Relatorio;
        destinatarios: Prisma.JsonValue;
        assunto: string | null;
        mensagem: string | null;
        tipo_relatorio: string;
        formato_pdf: boolean;
        formato_excel: boolean;
        frequencia: import(".prisma/client").$Enums.Frequencia_Envio;
        dia_do_mes: number | null;
        dia_da_semana: number | null;
        hora: number;
        minuto: number;
        ativo: boolean;
        proximo_envio_em: Date | null;
        ultimo_envio_em: Date | null;
        criado_por_id: string | null;
    }>;
    atualizar(id: string, dto: UpdateRelatorioAgendamentoDto): Promise<{
        criado_em: Date;
        alterado_em: Date;
        id: string;
        nome: string;
        periodo: import(".prisma/client").$Enums.Periodo_Relatorio;
        destinatarios: Prisma.JsonValue;
        assunto: string | null;
        mensagem: string | null;
        tipo_relatorio: string;
        formato_pdf: boolean;
        formato_excel: boolean;
        frequencia: import(".prisma/client").$Enums.Frequencia_Envio;
        dia_do_mes: number | null;
        dia_da_semana: number | null;
        hora: number;
        minuto: number;
        ativo: boolean;
        proximo_envio_em: Date | null;
        ultimo_envio_em: Date | null;
        criado_por_id: string | null;
    }>;
    remover(id: string): Promise<{
        message: string;
    }>;
    /** Dispara o envio agora, sem alterar a programação. */
    executarAgora(id: string): Promise<{
        sucesso: boolean;
        arquivos: string[];
        erro: string;
    }>;
    /**
     * Executa os agendamentos vencidos. Cada um é "reivindicado" de forma atômica
     * (avança o próximo envio antes de enviar), então duas instâncias do servidor
     * ou dois ciclos sobrepostos não enviam o mesmo relatório duas vezes.
     */
    executarVencidos(agora?: Date): Promise<void>;
    private executar;
    /** Aplica padrões e valida combinações que o class-validator não cobre. */
    private normalizar;
}
