import { Frequencia_Envio, Periodo_Relatorio } from '@prisma/client';
import {
  calcularPeriodo,
  calcularProximoEnvio,
} from '../relatorio-agendamento.utils';

// Brasília = UTC-3: 08:00 em Brasília é 11:00 UTC.
const brasilia = (iso: string) => new Date(`${iso}-03:00`);

describe('calcularProximoEnvio', () => {
  const mensalDia5 = {
    frequencia: Frequencia_Envio.MENSAL,
    dia_do_mes: 5,
    hora: 8,
    minuto: 0,
  };

  it('mensal: antes do dia 5 agenda para o dia 5 do mesmo mês', () => {
    const proximo = calcularProximoEnvio(mensalDia5, brasilia('2026-10-02T10:00:00'));
    expect(proximo.toISOString()).toBe(brasilia('2026-10-05T08:00:00').toISOString());
  });

  it('mensal: depois do horário no dia 5 vai para o mês seguinte', () => {
    const proximo = calcularProximoEnvio(mensalDia5, brasilia('2026-10-05T08:00:00'));
    expect(proximo.toISOString()).toBe(brasilia('2026-11-05T08:00:00').toISOString());
  });

  it('mensal: virada de ano', () => {
    const proximo = calcularProximoEnvio(mensalDia5, brasilia('2026-12-20T09:00:00'));
    expect(proximo.toISOString()).toBe(brasilia('2027-01-05T08:00:00').toISOString());
  });

  it('mensal: dia 31 em mês curto roda no último dia', () => {
    const proximo = calcularProximoEnvio(
      { ...mensalDia5, dia_do_mes: 31 },
      brasilia('2026-04-01T00:00:00'),
    );
    expect(proximo.toISOString()).toBe(brasilia('2026-04-30T08:00:00').toISOString());
  });

  it('mensal: dia 30 em fevereiro roda dia 28 (ano não bissexto)', () => {
    const proximo = calcularProximoEnvio(
      { ...mensalDia5, dia_do_mes: 30 },
      brasilia('2027-02-01T00:00:00'),
    );
    expect(proximo.toISOString()).toBe(brasilia('2027-02-28T08:00:00').toISOString());
  });

  it('usa o horário de Brasília mesmo quando já é "amanhã" em UTC', () => {
    // 22:30 em Brasília do dia 4 = 01:30 UTC do dia 5.
    const proximo = calcularProximoEnvio(mensalDia5, brasilia('2026-10-04T22:30:00'));
    expect(proximo.toISOString()).toBe(brasilia('2026-10-05T08:00:00').toISOString());
  });

  it('diária: se já passou do horário, agenda para o dia seguinte', () => {
    const proximo = calcularProximoEnvio(
      { frequencia: Frequencia_Envio.DIARIA, hora: 7, minuto: 30 },
      brasilia('2026-10-02T09:00:00'),
    );
    expect(proximo.toISOString()).toBe(brasilia('2026-10-03T07:30:00').toISOString());
  });

  it('semanal: próxima segunda-feira', () => {
    // 2026-10-02 é sexta-feira; segunda = 2026-10-05.
    const proximo = calcularProximoEnvio(
      { frequencia: Frequencia_Envio.SEMANAL, dia_da_semana: 1, hora: 8, minuto: 0 },
      brasilia('2026-10-02T12:00:00'),
    );
    expect(proximo.toISOString()).toBe(brasilia('2026-10-05T08:00:00').toISOString());
  });
});

describe('calcularPeriodo', () => {
  it('mês anterior: dia 5/out cobre setembro inteiro', () => {
    const p = calcularPeriodo(Periodo_Relatorio.MES_ANTERIOR, brasilia('2026-10-05T08:00:00'));
    expect(p.dataInicial).toBe('01-09-2026');
    expect(p.dataFinal).toBe('30-09-2026');
    expect(p.periodo).toBe('01-09-2026,30-09-2026');
    expect(p.anoInicial).toBe('2026');
  });

  it('mês anterior em janeiro cobre dezembro do ano passado', () => {
    const p = calcularPeriodo(Periodo_Relatorio.MES_ANTERIOR, brasilia('2027-01-05T08:00:00'));
    expect(p.dataInicial).toBe('01-12-2026');
    expect(p.dataFinal).toBe('31-12-2026');
    expect(p.anoInicial).toBe('2026');
    expect(p.anoFinal).toBe('2026');
  });

  it('mês atual vai do dia 1 até hoje', () => {
    const p = calcularPeriodo(Periodo_Relatorio.MES_ATUAL, brasilia('2026-10-15T08:00:00'));
    expect(p.dataInicial).toBe('01-10-2026');
    expect(p.dataFinal).toBe('15-10-2026');
  });

  it('ano atual vai de 1º de janeiro até hoje', () => {
    const p = calcularPeriodo(Periodo_Relatorio.ANO_ATUAL, brasilia('2026-10-15T08:00:00'));
    expect(p.dataInicial).toBe('01-01-2026');
    expect(p.dataFinal).toBe('15-10-2026');
    expect(p.anoInicial).toBe('2026');
    expect(p.anoFinal).toBe('2026');
  });
});
