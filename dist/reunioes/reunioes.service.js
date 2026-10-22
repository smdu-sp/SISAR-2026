import { ForbiddenException } from '../http/errors';
export class ReunioesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listaCompleta() {
        const lista = await this.prisma.reuniao_Processo.findMany({
            orderBy: { data_reuniao: 'asc' }
        });
        if (!lista || lista.length == 0)
            throw new ForbiddenException('Nenhuma subprefeitura encontrada');
        return lista;
    }
    async buscarPorMesAno(mes, ano) {
        const primeiroDiaMes = new Date(ano, mes - 1, 1);
        const ultimoDiaMes = new Date(ano, mes, 0);
        const reunioes = await this.prisma.reuniao_Processo.findMany({
            where: {
                OR: [
                    { AND: [
                            { nova_data_reuniao: { gte: primeiroDiaMes } },
                            { nova_data_reuniao: { lte: ultimoDiaMes } }
                        ]
                    },
                    {
                        AND: [
                            { nova_data_reuniao: null }, { data_reuniao: { gte: primeiroDiaMes } },
                            { nova_data_reuniao: null }, { data_reuniao: { lte: ultimoDiaMes } }
                        ]
                    }
                ]
            }
        });
        if (!reunioes || reunioes.length === 0)
            throw new ForbiddenException('Nenhuma reunião encontrada para o mês/ano especificado.');
        return reunioes;
    }
    async buscarPorId(idInt) {
        let id = idInt.toString();
        const reuniao_Processo = await this.prisma.reuniao_Processo.findUnique({ where: { id } });
        if (!reuniao_Processo)
            throw new ForbiddenException('reuniao não encontrada.');
        return reuniao_Processo;
    }
    async buscarPorInicial(inicialId) {
        const reunioes = await this.prisma.reuniao_Processo.findMany({
            where: { inicial_id: inicialId },
            orderBy: { instancia: 'asc' },
            include: { inicial: true },
        });
        return reunioes;
    }
    async atualizarData(id, updateReunioesDto) {
        updateReunioesDto.nova_data_reuniao = new Date(updateReunioesDto.nova_data_reuniao);
        updateReunioesDto.nova_data_reuniao.setUTCHours(updateReunioesDto.nova_data_reuniao.getUTCHours() - 3);
        const reuniao = await this.prisma.reuniao_Processo.update({
            where: { id },
            data: {
                nova_data_reuniao: updateReunioesDto.nova_data_reuniao,
                justificativa_remarcacao: updateReunioesDto.justificativa_remarcacao
            }
        });
        return reuniao;
    }
    async buscarPorData(data) {
        const reuniao_data = new Date(data).toISOString();
        const reunioes = await this.prisma.reuniao_Processo.findMany({
            where: {
                OR: [
                    { nova_data_reuniao: { equals: reuniao_data } },
                    { nova_data_reuniao: null, data_reuniao: { equals: reuniao_data } }
                ]
            },
            include: {
                inicial: true
            }
        });
        if (!reunioes)
            throw new ForbiddenException('Nenhuma reunião encontrada para a data especificada.');
        return reunioes;
    }
}
