import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';

/**
 * O servidor agenda no horário de Brasília (UTC-3, sem horário de verão desde 2019),
 * independente do fuso da máquina. Os campos "locais" são lidos com getUTC*.
 */
const OFFSET_BRASILIA_MS = -3 * 60 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;

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

function paraLocal(data: Date): Date {
  return new Date(data.getTime() + OFFSET_BRASILIA_MS);
}

function deLocal(ano: number, mes: number, dia: number, hora = 0, minuto = 0): Date {
  return new Date(Date.UTC(ano, mes, dia, hora, minuto) - OFFSET_BRASILIA_MS);
}

function diasNoMes(ano: number, mes: number): number {
  return new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
}

function dd(n: number): string {
  return String(n).padStart(2, '0');
}

/** Formato de data usado pelos relatórios do SISAR: dd-MM-yyyy. */
function formatar(ano: number, mes: number, dia: number): string {
  return `${dd(dia)}-${dd(mes + 1)}-${ano}`;
}

/**
 * Próxima execução estritamente posterior a `apos`.
 * Mensal com dia maior que o mês (ex.: 31 em abril) roda no último dia do mês.
 */
export function calcularProximoEnvio(config: ConfigAgenda, apos: Date): Date {
  const local = paraLocal(apos);
  const base = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());

  for (let i = 0; i <= 62; i++) {
    const dia = new Date(base + i * DIA_MS);
    const ano = dia.getUTCFullYear();
    const mes = dia.getUTCMonth();
    const numero = dia.getUTCDate();

    const confere =
      config.frequencia === Frequencia_Envio.DIARIA ||
      (config.frequencia === Frequencia_Envio.SEMANAL &&
        dia.getUTCDay() === config.dia_da_semana) ||
      (config.frequencia === Frequencia_Envio.MENSAL &&
        numero === Math.min(config.dia_do_mes ?? 1, diasNoMes(ano, mes)));
    if (!confere) continue;

    const candidato = deLocal(ano, mes, numero, config.hora, config.minuto);
    if (candidato.getTime() > apos.getTime()) return candidato;
  }
  throw new Error('Não foi possível calcular o próximo envio.');
}

/** Período do relatório relativo ao momento do envio. */
export function calcularPeriodo(tipo: Periodo_Relatorio, agora: Date): ParametrosPeriodo {
  const local = paraLocal(agora);
  const ano = local.getUTCFullYear();
  const mes = local.getUTCMonth();
  const hoje = local.getUTCDate();

  let inicio: [number, number, number];
  let fim: [number, number, number];

  if (tipo === Periodo_Relatorio.MES_ANTERIOR) {
    const anoAnt = mes === 0 ? ano - 1 : ano;
    const mesAnt = mes === 0 ? 11 : mes - 1;
    inicio = [anoAnt, mesAnt, 1];
    fim = [anoAnt, mesAnt, diasNoMes(anoAnt, mesAnt)];
  } else if (tipo === Periodo_Relatorio.MES_ATUAL) {
    inicio = [ano, mes, 1];
    fim = [ano, mes, hoje];
  } else {
    inicio = [ano, 0, 1];
    fim = [ano, mes, hoje];
  }

  const dataInicial = formatar(...inicio);
  const dataFinal = formatar(...fim);
  return {
    dataInicial,
    dataFinal,
    periodo: `${dataInicial},${dataFinal}`,
    anoInicial: String(inicio[0]),
    anoFinal: String(fim[0]),
  };
}
