import { BadRequestException, InternalServerErrorException } from '../http/errors';
export class MotivoInadmissaoService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async criar(dto) {
        const criado = await this.prisma.motivo_Inadmissao.create({
            data: { descricao: dto.descricao },
        });
        if (!criado) {
            throw new InternalServerErrorException('Não foi possível criar o motivo.');
        }
        return criado;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const where = busca ? { descricao: { contains: busca } } : {};
        const total = await this.prisma.motivo_Inadmissao.count({ where });
        if (total === 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const data = await this.prisma.motivo_Inadmissao.findMany({
            where,
            orderBy: { descricao: 'asc' },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return { total: +total, pagina: +pagina, limite: +limite, data };
    }
    async listaCompleta() {
        return this.prisma.motivo_Inadmissao.findMany({
            orderBy: { descricao: 'asc' },
        });
    }
    async buscarPorId(id) {
        if (!id)
            throw new BadRequestException('Id inválido.');
        const item = await this.prisma.motivo_Inadmissao.findUnique({
            where: { id },
        });
        if (!item)
            throw new BadRequestException('Motivo não encontrado.');
        return item;
    }
    async atualizar(id, dto) {
        await this.buscarPorId(id);
        return this.prisma.motivo_Inadmissao.update({
            where: { id },
            data: dto,
        });
    }
    async remover(id) {
        await this.buscarPorId(id);
        return this.prisma.motivo_Inadmissao.delete({ where: { id } });
    }
}
