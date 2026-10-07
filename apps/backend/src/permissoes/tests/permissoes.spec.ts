import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from 'src/auth/guards/role.guard';
import {
  AcessoLogado,
  Recurso,
} from 'src/auth/decorators/recurso.decorator';
import { PermissoesService } from '../permissoes.service';
import {
  CHAVES_RECURSOS,
  PERFIS,
  PERMISSOES_PADRAO,
  RECURSO_TRAVADO,
} from '../recursos';

describe('Padrão de permissões', () => {
  it('só usa recursos existentes no catálogo', () => {
    for (const perfil of PERFIS) {
      for (const recurso of PERMISSOES_PADRAO[perfil]) {
        expect(CHAVES_RECURSOS).toContain(recurso);
      }
    }
  });

  it('a gestão de permissões nunca é concedida pelo padrão (é implícita do DEV)', () => {
    for (const perfil of PERFIS) {
      expect(PERMISSOES_PADRAO[perfil]).not.toContain(RECURSO_TRAVADO);
    }
  });

  it('GAB_ASC: só painel, perfil, dashboard e relatórios (sem acesso a processos)', () => {
    expect([...PERMISSOES_PADRAO.GAB_ASC].sort()).toEqual(
      ['dashboard_admissibilidade', 'painel_inicial', 'perfil', 'relatorios'],
    );
  });

  it('relatórios e dashboard: DEV, ADM e GAB_ASC; envio automático: só DEV', () => {
    for (const recurso of ['relatorios', 'dashboard_admissibilidade']) {
      const comAcesso = PERFIS.filter((p) => PERMISSOES_PADRAO[p].includes(recurso));
      expect(comAcesso.sort()).toEqual(['ADM', 'DEV', 'GAB_ASC']);
    }
    const envio = PERFIS.filter((p) => PERMISSOES_PADRAO[p].includes('envio_relatorios'));
    expect(envio).toEqual(['DEV']);
  });
});

describe('PermissoesService', () => {
  const prisma = {
    permissao_Recurso: {
      findMany: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  let service: PermissoesService;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.permissao_Recurso.findMany.mockResolvedValue([
      { perfil: 'GAB_ASC', recurso: 'relatorios' },
      { perfil: 'USR', recurso: 'processos' },
      { perfil: 'DEV', recurso: 'relatorios' },
    ]);
    prisma.$transaction.mockResolvedValue([]);
    service = new PermissoesService(prisma as never);
  });

  it('temAlgum: verifica a matriz do perfil', async () => {
    expect(await service.temAlgum('GAB_ASC', ['relatorios'])).toBe(true);
    expect(await service.temAlgum('GAB_ASC', ['processos'])).toBe(false);
    expect(await service.temAlgum('GAB_ASC', ['processos', 'relatorios'])).toBe(true);
    expect(await service.temAlgum('USR', ['relatorios'])).toBe(false);
  });

  it('a gestão de permissões é só do DEV, mesmo sem linha no banco', async () => {
    expect(await service.temAlgum('DEV', [RECURSO_TRAVADO])).toBe(true);
    expect(await service.temAlgum('GAB_ASC', [RECURSO_TRAVADO])).toBe(false);
    expect(await service.temAlgum('ADM', [RECURSO_TRAVADO])).toBe(false);
  });

  it('DEV pode ter outros recursos removidos (sem bypass geral)', async () => {
    expect(await service.temAlgum('DEV', ['processos'])).toBe(false);
  });

  it('recursosDoPerfil inclui a gestão de permissões só para o DEV', async () => {
    expect(await service.recursosDoPerfil('DEV')).toContain(RECURSO_TRAVADO);
    expect(await service.recursosDoPerfil('GAB_ASC')).not.toContain(RECURSO_TRAVADO);
  });

  it('definir: rejeita recurso inexistente', async () => {
    await expect(service.definir('USR', ['nao_existe'])).rejects.toThrow(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('definir: nunca grava o recurso travado e remove duplicados', async () => {
    await service.definir('ADM', ['relatorios', 'relatorios', RECURSO_TRAVADO]);
    expect(prisma.permissao_Recurso.createMany).toHaveBeenCalledWith({
      data: [{ perfil: 'ADM', recurso: 'relatorios' }],
    });
  });

  it('usa cache e relê após alteração', async () => {
    await service.temAlgum('USR', ['processos']);
    await service.temAlgum('USR', ['processos']);
    expect(prisma.permissao_Recurso.findMany).toHaveBeenCalledTimes(1);
    await service.definir('USR', ['processos']);
    await service.temAlgum('USR', ['processos']);
    expect(prisma.permissao_Recurso.findMany).toHaveBeenCalledTimes(2);
  });
});

describe('RoleGuard', () => {
  class Rotas {
    semDecorator() {}

    @Recurso('relatorios')
    relatorios() {}

    @Recurso('unidades', 'relatorios')
    qualquerUm() {}

    @AcessoLogado()
    logado() {}
  }
  const rotas = new Rotas();
  const permissoes = { temAlgum: jest.fn() };
  const guard = new RoleGuard(new Reflector(), permissoes as never);

  const contexto = (handler: () => void, usuario: unknown) =>
    ({
      getHandler: () => handler,
      getClass: () => Rotas,
      switchToHttp: () => ({ getRequest: () => ({ user: usuario }) }),
    }) as unknown as ExecutionContext;

  beforeEach(() => permissoes.temAlgum.mockReset());

  it('rota pública (sem usuário) passa sem consultar permissões', async () => {
    expect(await guard.canActivate(contexto(rotas.relatorios, undefined))).toBe(true);
    expect(permissoes.temAlgum).not.toHaveBeenCalled();
  });

  it('@AcessoLogado libera qualquer usuário autenticado', async () => {
    expect(
      await guard.canActivate(contexto(rotas.logado, { permissao: 'GAB_ASC' })),
    ).toBe(true);
    expect(permissoes.temAlgum).not.toHaveBeenCalled();
  });

  it('@Recurso consulta o perfil com os recursos da rota', async () => {
    permissoes.temAlgum.mockResolvedValue(true);
    expect(
      await guard.canActivate(contexto(rotas.qualquerUm, { permissao: 'ADM' })),
    ).toBe(true);
    expect(permissoes.temAlgum).toHaveBeenCalledWith('ADM', ['unidades', 'relatorios']);
  });

  it('sem decorator exige o recurso "processos"', async () => {
    permissoes.temAlgum.mockResolvedValue(false);
    expect(
      await guard.canActivate(contexto(rotas.semDecorator, { permissao: 'GAB_ASC' })),
    ).toBe(false);
    expect(permissoes.temAlgum).toHaveBeenCalledWith('GAB_ASC', ['processos']);
  });

  it('nega quando o perfil não tem o recurso', async () => {
    permissoes.temAlgum.mockResolvedValue(false);
    expect(
      await guard.canActivate(contexto(rotas.relatorios, { permissao: 'USR' })),
    ).toBe(false);
  });
});
