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
export declare function calcularProximoEnvio(config: ConfigAgenda, apos: Date): Date;
export declare function calcularPeriodo(tipo: Periodo_Relatorio, agora: Date): ParametrosPeriodo;
