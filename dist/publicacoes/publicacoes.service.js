import { BadRequestException, InternalServerErrorException } from '../http/errors';
import { $Enums } from '@prisma/client';
export class PublicacoesService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
        this.include = { tecnico: true, unidade: true };
    }
    async validarRelacionamentos(tecnico_id, unidade_id) {
        if (tecnico_id) {
            const tecnico = await this.prisma.usuario.findUnique({
                where: { id: tecnico_id },
            });
            if (!tecnico)
                throw new BadRequestException('Técnico não encontrado.');
        }
        if (unidade_id) {
            const unidade = await this.prisma.unidade.findUnique({
                where: { id: unidade_id },
            });
            if (!unidade) {
                throw new BadRequestException('Unidade não encontrada.');
            }
        }
    }
    async criar(dto) {
        await this.validarRelacionamentos(dto.tecnico_rf, dto.unidade_id);
        const criada = await this.prisma.publicacao.create({
            data: {
                numero_processo: dto.numero_processo,
                tipo_documento: dto.tipo_documento,
                colegiado: dto.colegiado,
                data_emissao: dto.data_emissao,
                data_publicacao: dto.data_publicacao,
                prazo: dto.prazo,
                tecnico: { connect: { id: dto.tecnico_rf } },
                unidade: { connect: { id: dto.unidade_id } },
            },
            include: this.include,
        });
        if (!criada) {
            throw new InternalServerErrorException('Não foi possível criar a publicação.');
        }
        return criada;
    }
    async buscarTudo(pagina = 1, limite = 10, busca, tipo_documento, colegiado) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const tipoDocumentoFiltro = tipo_documento && tipo_documento !== 'all'
            ? $Enums.Tipo_Documento[tipo_documento]
            : undefined;
        const colegiadoFiltro = colegiado && colegiado !== 'all' ? $Enums.Colegiado[colegiado] : undefined;
        const where = {
            ...(busca && { numero_processo: { contains: busca } }),
            ...(tipoDocumentoFiltro && { tipo_documento: tipoDocumentoFiltro }),
            ...(colegiadoFiltro && { colegiado: colegiadoFiltro }),
        };
        const total = await this.prisma.publicacao.count({ where });
        if (total === 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
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
    async buscarPorId(id) {
        if (!id)
            throw new BadRequestException('Id inválido.');
        const item = await this.prisma.publicacao.findUnique({
            where: { id },
            include: this.include,
        });
        if (!item)
            throw new BadRequestException('Publicação não encontrada.');
        return item;
    }
    async atualizar(id, dto) {
        await this.buscarPorId(id);
        await this.validarRelacionamentos(dto.tecnico_rf, dto.unidade_id);
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
                ...(dto.unidade_id && {
                    unidade: { connect: { id: dto.unidade_id } },
                }),
            },
            include: this.include,
        });
    }
}
