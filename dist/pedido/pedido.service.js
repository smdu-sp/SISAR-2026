import { BadRequestException, ForbiddenException, InternalServerErrorException } from '../http/errors';
export class PedidoService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async criar(dto) {
        const existe = await this.prisma.pedido.findUnique({
            where: { descricao: dto.descricao },
        });
        if (existe) {
            throw new ForbiddenException('Já existe um pedido com esta descrição.');
        }
        const criado = await this.prisma.pedido.create({ data: dto });
        if (!criado) {
            throw new InternalServerErrorException('Não foi possível criar o pedido.');
        }
        return criado;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const where = busca ? { descricao: { contains: busca } } : {};
        const total = await this.prisma.pedido.count({ where });
        if (total === 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const data = await this.prisma.pedido.findMany({
            where,
            orderBy: { descricao: 'asc' },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return { total: +total, pagina: +pagina, limite: +limite, data };
    }
    async listaCompleta() {
        return this.prisma.pedido.findMany({ orderBy: { descricao: 'asc' } });
    }
    async buscarPorId(id) {
        if (!id)
            throw new BadRequestException('Id inválido.');
        const item = await this.prisma.pedido.findUnique({ where: { id } });
        if (!item)
            throw new BadRequestException('Pedido não encontrado.');
        return item;
    }
    async atualizar(id, dto) {
        await this.buscarPorId(id);
        if (dto.descricao) {
            const duplicado = await this.prisma.pedido.findFirst({
                where: { descricao: dto.descricao, NOT: { id } },
            });
            if (duplicado) {
                throw new ForbiddenException('Já existe um pedido com esta descrição.');
            }
        }
        return this.prisma.pedido.update({ where: { id }, data: dto });
    }
    async remover(id) {
        await this.buscarPorId(id);
        return this.prisma.pedido.delete({ where: { id } });
    }
}
