import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { UnidadeResponseDTO } from './dto/unidade-response.dto';
import { Nivel_Unidade, Unidade } from '@prisma/client';

/** Nível do pai exigido para cada nível de unidade (null = deve ser raiz). */
const NIVEL_PAI: Record<Nivel_Unidade, Nivel_Unidade | null> = {
  COORDENADORIA: null,
  DIRETORIA: Nivel_Unidade.COORDENADORIA,
  UNIDADE: Nivel_Unidade.DIRETORIA,
};

@Injectable()
export class UnidadesService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) {}

  async listaCompleta(nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO[]> {
    return await this.prisma.unidade.findMany({
      where: { ...(nivel ? { nivel } : {}) },
      orderBy: { nome: 'asc' }
    });
  }

  /** Árvore hierárquica (coordenadoria > diretoria > unidade) para a tela de administração. */
  async arvore(busca?: string) {
    const todas = await this.prisma.unidade.findMany({
      orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
    });
    const filtro = busca?.trim().toLowerCase();
    const combina = (u: Unidade) =>
      !filtro ||
      [u.nome, u.sigla, u.codigo].some((c) => c?.toLowerCase().includes(filtro));

    const porPai = new Map<string | null, (Unidade & { filhas: unknown[] })[]>();
    for (const u of todas) {
      const chave = u.unidade_pai_id ?? null;
      if (!porPai.has(chave)) porPai.set(chave, []);
      porPai.get(chave).push({ ...u, filhas: [] });
    }
    const montar = (paiId: string | null): (Unidade & { filhas: unknown[] })[] =>
      (porPai.get(paiId) ?? []).map((no) => ({
        ...no,
        filhas: montar(no.id),
      }));

    // Com busca, mantém um nó se ele combina ou tem descendente que combina.
    const podar = (nos: (Unidade & { filhas: unknown[] })[]): (Unidade & { filhas: unknown[] })[] =>
      nos
        .map((no) => ({ ...no, filhas: podar(no.filhas as (Unidade & { filhas: unknown[] })[]) }))
        .filter((no) => combina(no) || (no.filhas as unknown[]).length > 0);

    const arvore = montar(null);
    return filtro ? podar(arvore) : arvore;
  }

  async buscaPorCodigo(codigo: string): Promise<UnidadeResponseDTO> {
    return await this.prisma.unidade.findFirst({ where: { codigo } });
  }

  async buscaPorSigla(sigla: string): Promise<UnidadeResponseDTO> {
    return await this.prisma.unidade.findFirst({ where: { sigla } });
  }

  async buscaPorNome(nome: string, nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO> {
    return await this.prisma.unidade.findFirst({
      where: { nome, ...(nivel ? { nivel } : {}) },
    });
  }

  /** Valida se o pai informado é compatível com o nível da unidade. */
  private async validarHierarquia(nivel: Nivel_Unidade, unidade_pai_id?: string) {
    const paiEsperado = NIVEL_PAI[nivel];
    if (!unidade_pai_id) {
      if (paiEsperado)
        throw new ForbiddenException(
          `Unidade de nível ${nivel} precisa estar vinculada a uma unidade ${paiEsperado.toLowerCase()}.`,
        );
      return;
    }
    if (!paiEsperado)
      throw new ForbiddenException('Coordenadoria não pode ter unidade pai.');
    const pai = await this.prisma.unidade.findUnique({ where: { id: unidade_pai_id } });
    if (!pai) throw new ForbiddenException('Unidade pai não encontrada.');
    if (pai.nivel !== paiEsperado)
      throw new ForbiddenException(
        `Unidade de nível ${nivel} deve ter como pai uma unidade ${paiEsperado.toLowerCase()}.`,
      );
  }

  async criar(createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDTO> {
    const { nome, sigla, codigo, status, nivel, unidade_pai_id } = createUnidadeDto;
    await this.validarHierarquia(nivel, unidade_pai_id);
    if (await this.buscaPorNome(nome, nivel))
      throw new ForbiddenException(`Já existe uma unidade de mesmo nível com o nome (${nome}).`);
    if (codigo && await this.buscaPorCodigo(codigo))
      throw new ForbiddenException(`Já existe uma unidade com o mesmo código (${codigo}).`);
    if (sigla && await this.buscaPorSigla(sigla))
      throw new ForbiddenException(`Já existe uma unidade com a mesma sigla (${sigla}).`);
    const novaUnidade: Unidade = await this.prisma.unidade.create({
      data: {
        nome,
        sigla: sigla || null,
        codigo: codigo || null,
        status: status ?? 1,
        nivel,
        unidade_pai_id: unidade_pai_id || null,
      }
    });
    if (!novaUnidade)
      throw new InternalServerErrorException('Não foi possível criar a unidade. Tente novamente.');
    return novaUnidade;
  }

  async buscarTudo(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
    filtro?: number,
    nivel?: Nivel_Unidade
  ): Promise<{ total: number, pagina: number, limite: number, data: Unidade[] }> {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca ?
        {
          OR: [
            { nome: { contains: busca } },
            { sigla: { contains: busca } },
            { codigo: { contains: busca } }
          ]
        } :
        {}),
      ...(nivel ? { nivel } : {}),
    };
    const total: number = await this.prisma.unidade.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const unidades: Unidade[] = await this.prisma.unidade.findMany({
      where: {
        AND: [
          searchParams,
          { status: filtro < 0 || !filtro && filtro !== 0 ? undefined : filtro },
        ]
      },
      include: { unidade_pai: { select: { id: true, nome: true, sigla: true, nivel: true } } },
      orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
      skip: (pagina - 1) * limite,
      take: limite,
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: unidades
    };
  }

  async buscarPorId(id: string): Promise<UnidadeResponseDTO> {
    return await this.prisma.unidade.findUnique({ where: { id } });
  }

  async atualizar(id: string, updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDTO> {
    const { nome, sigla, codigo, nivel, unidade_pai_id } = updateUnidadeDto;
    const unidade: Unidade = await this.prisma.unidade.findUnique({ where: { id } });
    if (!unidade) throw new ForbiddenException('Unidade não encontrada.');
    const nivelFinal = nivel ?? unidade.nivel;
    if (nivel !== undefined || unidade_pai_id !== undefined) {
      const paiFinal =
        unidade_pai_id !== undefined ? unidade_pai_id : unidade.unidade_pai_id;
      if (paiFinal === id)
        throw new ForbiddenException('Uma unidade não pode ser pai de si mesma.');
      await this.validarHierarquia(nivelFinal, paiFinal || undefined);
    }
    if (nome) {
      const unidadeNome: Unidade = await this.buscaPorNome(nome, nivelFinal);
      if (unidadeNome && unidadeNome.id != id)
        throw new ForbiddenException(`Já existe uma unidade de mesmo nível com o nome (${nome}).`);
    }
    if (sigla) {
      const unidadeSigla: Unidade = await this.buscaPorSigla(sigla);
      if (unidadeSigla && unidadeSigla.id != id)
        throw new ForbiddenException(`Já existe uma unidade com a mesma sigla (${sigla}).`);
    }
    if (codigo) {
      const unidadeCodigo: Unidade = await this.buscaPorCodigo(codigo);
      if (unidadeCodigo && unidadeCodigo.id != id)
        throw new ForbiddenException(`Já existe uma unidade com o mesmo código (${codigo}).`);
    }
    const updatedUnidade: Unidade = await this.prisma.unidade.update({
      where: { id },
      data: {
        ...updateUnidadeDto,
        ...(sigla !== undefined ? { sigla: sigla || null } : {}),
        ...(codigo !== undefined ? { codigo: codigo || null } : {}),
        ...(unidade_pai_id !== undefined ? { unidade_pai_id: unidade_pai_id || null } : {}),
      }
    });
    if (!updatedUnidade)
      throw new InternalServerErrorException('Não foi possível atualizar a unidade. Tente novamente.');
    return updatedUnidade;
  }

  async desativar(id: string): Promise<{ message: string }> {
    const unidade: Unidade = await this.prisma.unidade.findUnique({ where: { id } });
    if (!unidade) throw new ForbiddenException('Unidade não encontrada.');
    const updatedUnidade: Unidade = await this.prisma.unidade.update({
      where: { id },
      data: { status: 0 }
    });
    if (!updatedUnidade)
      throw new InternalServerErrorException('Não foi possível desativar a unidade. Tente novamente.');
    return {
      message: 'Unidade desativada com sucesso.'
    }
  }
}
