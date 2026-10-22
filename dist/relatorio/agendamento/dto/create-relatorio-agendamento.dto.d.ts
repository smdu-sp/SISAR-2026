import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
export declare class CreateRelatorioAgendamentoDto {
    nome: string;
    tipo_relatorio: string;
    formato_pdf?: boolean;
    formato_excel?: boolean;
    destinatarios: string[];
    assunto?: string;
    mensagem?: string;
    frequencia: Frequencia_Envio;
    dia_do_mes?: number;
    dia_da_semana?: number;
    hora?: number;
    minuto?: number;
    periodo?: Periodo_Relatorio;
    ativo?: boolean;
}
