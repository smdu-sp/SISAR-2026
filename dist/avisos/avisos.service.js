import { InternalServerErrorException } from '../http/errors';
export class AvisosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAvisoDto, usuario_id) {
        let { titulo, descricao, data, inicial_id } = createAvisoDto;
        const criar = await this.prisma.avisos.create({
            data: { titulo, descricao, data, usuario_id, inicial_id }
        });
        if (!criar)
            throw new InternalServerErrorException('Não foi possível criar o aviso. Tente novamente.');
        return criar;
    }
    async findOne(data, usuario_id) {
        if (data instanceof Date)
            data.setHours(0, 0, 0, 0);
        const reuniao_data = new Date(data).toISOString();
        const reunioes = await this.prisma.avisos.findMany({
            include: {
                inicial: true
            },
            where: {
                AND: [
                    {
                        OR: [
                            { usuario_id: { equals: usuario_id } },
                            { usuario_id: { equals: null } }
                        ]
                    },
                    { data: { equals: reuniao_data } }
                ]
            }
        });
        if (!reunioes)
            throw new InternalServerErrorException('Nenhuma reunião encontrada para a data especificada.');
        return reunioes;
    }
    async buscarPorMesAno(mes, ano, usuario_id) {
        const primeiroDiaMes = new Date(ano, mes - 1, 1);
        const ultimoDiaMes = new Date(ano, mes, 0);
        const avisos = await this.prisma.avisos.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { usuario_id: { equals: usuario_id } },
                            { usuario_id: { equals: null } }
                        ]
                    },
                    { data: { gte: primeiroDiaMes } },
                    { data: { lte: ultimoDiaMes } }
                ]
            }
        });
        if (!avisos || avisos.length === 0)
            throw new InternalServerErrorException('Nenhuma reunião encontrada para o mês/ano especificado.');
        return avisos;
    }
    async update(id, updateAvisoDto) {
        const atualizar = await this.prisma.avisos.update({
            where: { id },
            data: updateAvisoDto
        });
        return atualizar;
    }
    async remove(id) {
        const deletar = await this.prisma.avisos.delete({
            where: { id }
        });
        return deletar;
    }
}
