import {
  BadRequestException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Permissao } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CHAVES_RECURSOS,
  PERFIS,
  PERMISSOES_PADRAO,
  RECURSOS,
  RECURSO_TRAVADO,
} from './recursos';

/** Tempo máximo em que uma instância usa a matriz em memória sem reler o banco. */
const TTL_CACHE_MS = 30_000;

@Injectable()
export class PermissoesService implements OnModuleInit {
  private cache: Map<Permissao, Set<string>> | null = null;
  private cacheExpiraEm = 0;

  constructor(private readonly prisma: PrismaService) {}

  /** Banco recém-criado sem a matriz: aplica o padrão. */
  async onModuleInit() {
    if ((await this.prisma.permissao_Recurso.count()) === 0) {
      await this.restaurarPadrao();
    }
  }

  async temAlgum(perfil: Permissao, chaves: string[]): Promise<boolean> {
    // A gestão de permissões é sempre (e somente) do DEV, para não haver bloqueio total.
    if (chaves.includes(RECURSO_TRAVADO) && perfil === 'DEV') return true;
    const permitidos = (await this.carregar()).get(perfil);
    return chaves.some(
      (chave) => chave !== RECURSO_TRAVADO && permitidos?.has(chave),
    );
  }

  async recursosDoPerfil(perfil: Permissao): Promise<string[]> {
    const recursos = [...((await this.carregar()).get(perfil) ?? [])];
    if (perfil === 'DEV') recursos.push(RECURSO_TRAVADO);
    return recursos;
  }

  async matriz() {
    const mapa = await this.carregar();
    return {
      recursos: RECURSOS,
      perfis: PERFIS,
      travado: RECURSO_TRAVADO,
      matriz: Object.fromEntries(
        PERFIS.map((p) => [p, [...(mapa.get(p) ?? [])]]),
      ) as Record<Permissao, string[]>,
    };
  }

  async definir(perfil: Permissao, recursos: string[]) {
    const invalidos = recursos.filter((r) => !CHAVES_RECURSOS.includes(r));
    if (invalidos.length > 0) {
      throw new BadRequestException(
        `Recurso(s) inválido(s): ${invalidos.join(', ')}.`,
      );
    }
    // O recurso travado nunca é gravado: é implícito para o DEV.
    const unicos = [...new Set(recursos)].filter((r) => r !== RECURSO_TRAVADO);
    await this.prisma.$transaction([
      this.prisma.permissao_Recurso.deleteMany({ where: { perfil } }),
      this.prisma.permissao_Recurso.createMany({
        data: unicos.map((recurso) => ({ perfil, recurso })),
      }),
    ]);
    this.invalidar();
    return this.matriz();
  }

  async restaurarPadrao() {
    const dados = PERFIS.flatMap((perfil) =>
      PERMISSOES_PADRAO[perfil].map((recurso) => ({ perfil, recurso })),
    );
    await this.prisma.$transaction([
      this.prisma.permissao_Recurso.deleteMany({}),
      this.prisma.permissao_Recurso.createMany({ data: dados }),
    ]);
    this.invalidar();
    return this.matriz();
  }

  private invalidar() {
    this.cache = null;
  }

  private async carregar(): Promise<Map<Permissao, Set<string>>> {
    if (this.cache && Date.now() < this.cacheExpiraEm) return this.cache;
    const linhas = await this.prisma.permissao_Recurso.findMany();
    const mapa = new Map<Permissao, Set<string>>();
    for (const { perfil, recurso } of linhas) {
      if (!mapa.has(perfil)) mapa.set(perfil, new Set());
      mapa.get(perfil).add(recurso);
    }
    this.cache = mapa;
    this.cacheExpiraEm = Date.now() + TTL_CACHE_MS;
    return mapa;
  }
}
