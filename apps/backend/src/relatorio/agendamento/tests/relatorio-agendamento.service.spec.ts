import { BadRequestException } from '@nestjs/common';
import { RelatorioAgendamentoService } from '../relatorio-agendamento.service';

const agendamentoBase = {
  id: 'ag-1',
  nome: 'Quantitativo mensal',
  tipo_relatorio: 'ar-quantitativo',
  formato_pdf: true,
  formato_excel: true,
  destinatarios: ['a@x.gov.br', 'b@x.gov.br'],
  assunto: null,
  mensagem: null,
  frequencia: 'MENSAL',
  dia_do_mes: 5,
  dia_da_semana: null,
  hora: 8,
  minuto: 0,
  periodo: 'MES_ANTERIOR',
  ativo: true,
  proximo_envio_em: new Date('2026-10-05T11:00:00Z'),
  ultimo_envio_em: null,
};

describe('RelatorioAgendamentoService', () => {
  const prisma = {
    relatorio_Agendamento: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    relatorio_Agendamento_Envio: { create: jest.fn() },
  };
  const email = { configurado: jest.fn() };
  const relatorioEmail = { enviarMultiplos: jest.fn() };
  let service: RelatorioAgendamentoService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new RelatorioAgendamentoService(
      prisma as never,
      email as never,
      relatorioEmail as never,
    );
  });

  it('executa o vencido: envia PDF e Excel, registra sucesso e avança a programação', async () => {
    prisma.relatorio_Agendamento.findMany.mockResolvedValue([agendamentoBase]);
    prisma.relatorio_Agendamento.updateMany.mockResolvedValue({ count: 1 });
    email.configurado.mockReturnValue(true);
    relatorioEmail.enviarMultiplos.mockResolvedValue({ arquivos: ['r.pdf', 'r.xlsx'] });

    await service.executarVencidos(new Date('2026-10-05T11:00:30Z'));

    const dados = prisma.relatorio_Agendamento.updateMany.mock.calls[0][0].data;
    expect(dados.proximo_envio_em.toISOString()).toBe('2026-11-05T11:00:00.000Z');
    expect(relatorioEmail.enviarMultiplos).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoRelatorio: 'ar-quantitativo',
        formatos: ['pdf', 'excel'],
        destinatarios: ['a@x.gov.br', 'b@x.gov.br'],
        filtros: expect.objectContaining({
          dataInicial: '01-09-2026',
          dataFinal: '30-09-2026',
        }),
      }),
    );
    expect(prisma.relatorio_Agendamento_Envio.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ origem: 'AGENDADO', sucesso: true, erro: null }),
    });
    expect(prisma.relatorio_Agendamento.update).toHaveBeenCalled();
  });

  it('não envia se outra instância já reivindicou o agendamento', async () => {
    prisma.relatorio_Agendamento.findMany.mockResolvedValue([agendamentoBase]);
    prisma.relatorio_Agendamento.updateMany.mockResolvedValue({ count: 0 });

    await service.executarVencidos(new Date('2026-10-05T11:00:30Z'));

    expect(relatorioEmail.enviarMultiplos).not.toHaveBeenCalled();
    expect(prisma.relatorio_Agendamento_Envio.create).not.toHaveBeenCalled();
  });

  it('e-mail não configurado: registra a falha no histórico e não lança erro', async () => {
    prisma.relatorio_Agendamento.findUnique.mockResolvedValue(agendamentoBase);
    email.configurado.mockReturnValue(false);

    const resultado = await service.executarAgora('ag-1');

    expect(resultado.sucesso).toBe(false);
    expect(resultado.erro).toContain('não configurado');
    expect(relatorioEmail.enviarMultiplos).not.toHaveBeenCalled();
    expect(prisma.relatorio_Agendamento_Envio.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ origem: 'MANUAL', sucesso: false }),
    });
    expect(prisma.relatorio_Agendamento.update).not.toHaveBeenCalled();
  });

  it('criar: exige dia do mês na frequência mensal e ao menos um formato', async () => {
    const base = {
      nome: 'x',
      tipo_relatorio: 'ar-quantitativo',
      destinatarios: ['a@x.gov.br'],
      frequencia: 'MENSAL',
    };
    await expect(service.criar(base as never)).rejects.toThrow(BadRequestException);
    await expect(
      service.criar({ ...base, dia_do_mes: 5, formato_pdf: false, formato_excel: false } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('criar: calcula o próximo envio e remove destinatários repetidos', async () => {
    prisma.relatorio_Agendamento.create.mockImplementation(async ({ data }) => data);

    const criado = await service.criar(
      {
        nome: 'x',
        tipo_relatorio: 'ar-quantitativo',
        destinatarios: ['A@x.gov.br', 'a@x.gov.br'],
        frequencia: 'MENSAL',
        dia_do_mes: 5,
      } as never,
      'user-1',
    );

    expect(criado.destinatarios).toEqual(['a@x.gov.br']);
    expect(criado.proximo_envio_em).toBeInstanceOf(Date);
    expect(criado.criado_por_id).toBe('user-1');
  });
});
