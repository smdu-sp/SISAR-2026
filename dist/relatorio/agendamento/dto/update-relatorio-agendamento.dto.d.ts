import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
/** Equivale ao PartialType(CreateRelatorioAgendamentoDto) do Nest: todos os campos opcionais, mesmas regras. */
export declare class UpdateRelatorioAgendamentoDto {
    nome?: string;
    tipo_relatorio?: string;
    formato_pdf?: boolean;
    formato_excel?: boolean;
    destinatarios?: string[];
    assunto?: string;
    mensagem?: string;
    frequencia?: Frequencia_Envio;
    dia_do_mes?: number;
    dia_da_semana?: number;
    hora?: number;
    minuto?: number;
    periodo?: Periodo_Relatorio;
    ativo?: boolean;
}
