import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
export interface ConfigAgenda {
    frequencia: Frequencia_Envio;
    dia_do_mes?: number | null;
    dia_da_semana?: number | null;
    hora: number;
    minuto: number;
}
export interface ParametrosPeriodo {
    dataInicial: string;
    dataFinal: string;
    periodo: string;
    anoInicial: string;
    anoFinal: string;
}
/**
 * Próxima execução estritamente posterior a `apos`.
 * Mensal com dia maior que o mês (ex.: 31 em abril) roda no último dia do mês.
 */
export declare function calcularProximoEnvio(config: ConfigAgenda, apos: Date): Date;
/** Período do relatório relativo ao momento do envio. */
export declare function calcularPeriodo(tipo: Periodo_Relatorio, agora: Date): ParametrosPeriodo;
