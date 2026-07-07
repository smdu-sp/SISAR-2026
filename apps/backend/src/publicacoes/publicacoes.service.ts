import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { $Enums, Publicacao } from '@prisma/client';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';

@Injectable()
export class PublicacoesService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
  ) {}

  private include = { tecnico: true, coordenadoria: true };

  private async validarRelacionamentos(tecnico_id?: string, coordenadoria_id?: string) {
    if (tecnico_id) {
      const tecnico = await this.prisma.usuario.findUnique({
        where: { id: tecnico_id },
      });
      if (!tecnico) throw new BadRequestException('Técnico não encontrado.');
    }
    if (coordenadoria_id) {
      const coordenadoria = await this.prisma.coordenadoria.findUnique({
        where: { id: coordenadoria_id },
      });
      if (!coordenadoria) {
        throw new BadRequestException('Coordenadoria não encontrada.');
      }
    }
  }

  async criar(dto: CreatePublicacaoDto): Promise<Publicacao> {
    await this.validarRelacionamentos(dto.tecnico_rf, dto.coordenadoria_id);
    const criada = await this.prisma.publicacao.create({
      data: {
        numero_processo: dto.numero_processo,
        tipo_documento: dto.tipo_documento,
        colegiado: dto.colegiado,
        data_emissao: dto.data_emissao,
        data_publicacao: dto.data_publicacao,
        prazo: dto.prazo,
        tecnico: { connect: { id: dto.tecnico_rf } },
        coordenadoria: { connect: { id: dto.coordenadoria_id } },
      },
      include: this.include,
    });
    if (!criada) {
      throw new InternalServerErrorException(
        'Não foi possível criar a publicação.',
      );
    }
    return criada;
  }

  async buscarTudo(
    pagina = 1,
    limite = 10,
    busca?: string,
    tipo_documento?: string,
    colegiado?: string,
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);

    const tipoDocumentoFiltro =
      tipo_documento && tipo_documento !== 'all'
        ? $Enums.Tipo_Documento[tipo_documento]
        : undefined;
    const colegiadoFiltro =
      colegiado && colegiado !== 'all' ? $Enums.Colegiado[colegiado] : undefined;

    const where = {
      ...(busca && { numero_processo: { contains: busca } }),
      ...(tipoDocumentoFiltro && { tipo_documento: tipoDocumentoFiltro }),
      ...(colegiadoFiltro && { colegiado: colegiadoFiltro }),
    };

    const total = await this.prisma.publicacao.count({ where });
    if (total === 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const data = await this.prisma.publicacao.findMany({
      where,
      orderBy: { criado_em: 'desc' },
      skip: (pagina - 1) * limite,
      take: limite,
      include: this.include,
    });
    return { total: +total, pagina: +pagina, limite: +limite, data };
  }

  async buscarPorId(id: string) {
    if (!id) throw new BadRequestException('Id inválido.');
    const item = await this.prisma.publicacao.findUnique({
      where: { id },
      include: this.include,
    });
    if (!item) throw new BadRequestException('Publicação não encontrada.');
    return item;
  }

  async atualizar(id: string, dto: UpdatePublicacaoDto): Promise<Publicacao> {
    await this.buscarPorId(id);
    await this.validarRelacionamentos(dto.tecnico_rf, dto.coordenadoria_id);
    return this.prisma.publicacao.update({
      where: { id },
      data: {
        numero_processo: dto.numero_processo,
        tipo_documento: dto.tipo_documento,
        colegiado: dto.colegiado,
        data_emissao: dto.data_emissao,
        data_publicacao: dto.data_publicacao,
        prazo: dto.prazo,
        ...(dto.tecnico_rf && { tecnico: { connect: { id: dto.tecnico_rf } } }),
        ...(dto.coordenadoria_id && {
          coordenadoria: { connect: { id: dto.coordenadoria_id } },
        }),
      },
      include: this.include,
    });
  }
}
