import { BadRequestException, ForbiddenException, InternalServerErrorException } from '../http/errors';
export class CategoriaService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async criar(dto) {
        const existe = await this.prisma.categoria.findUnique({
            where: { categoria: dto.categoria },
        });
        if (existe) {
            throw new ForbiddenException('Já existe uma categoria com este nome.');
        }
        const criada = await this.prisma.categoria.create({
            data: {
                categoria: dto.categoria,
                descricao: dto.descricao ?? '',
                divisao: dto.divisao ?? '',
                competencia: dto.competencia ?? '',
            },
        });
        if (!criada) {
            throw new InternalServerErrorException('Não foi possível criar a categoria.');
        }
        return criada;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const where = busca
            ? {
                OR: [
                    { categoria: { contains: busca } },
                    { descricao: { contains: busca } },
                    { divisao: { contains: busca } },
                ],
            }
            : {};
        const total = await this.prisma.categoria.count({ where });
        if (total === 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const data = await this.prisma.categoria.findMany({
            where,
            orderBy: { categoria: 'asc' },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return { total: +total, pagina: +pagina, limite: +limite, data };
    }
    async listaCompleta() {
        return this.prisma.categoria.findMany({ orderBy: { categoria: 'asc' } });
    }
    async buscarPorId(id) {
        if (!id)
            throw new BadRequestException('Id inválido.');
        const item = await this.prisma.categoria.findUnique({ where: { id } });
        if (!item)
            throw new BadRequestException('Categoria não encontrada.');
        return item;
    }
    async atualizar(id, dto) {
        await this.buscarPorId(id);
        if (dto.categoria) {
            const duplicada = await this.prisma.categoria.findFirst({
                where: { categoria: dto.categoria, NOT: { id } },
            });
            if (duplicada) {
                throw new ForbiddenException('Já existe uma categoria com este nome.');
            }
        }
        return this.prisma.categoria.update({ where: { id }, data: dto });
    }
    async remover(id) {
        await this.buscarPorId(id);
        return this.prisma.categoria.delete({ where: { id } });
    }
}
