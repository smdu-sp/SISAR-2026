import { ForbiddenException } from '../http/errors';
export class DistribuicaoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(createDistribuicaoDto) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: createDistribuicaoDto.inicial_id }
        });
        if (distribuicao)
            throw new ForbiddenException('Erro ao criar distribuição. Processo já foi alocado.');
        const nova_distribuicao = await this.prisma.distribuicao.create({
            data: createDistribuicaoDto
        });
        if (!nova_distribuicao)
            throw new ForbiddenException('Erro ao criar distribuição. Tente novamente.');
        return nova_distribuicao;
    }
    async atualizar(inicial_id, updateDistribuicaoDto) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: inicial_id },
            include: {
                tecnico_responsavel: true,
                administrativo_responsavel: true
            }
        });
        if (!distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const { administrativo_responsavel_id, tecnico_responsavel_id } = updateDistribuicaoDto;
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: {
                ...(administrativo_responsavel_id && { administrativo_responsavel_id }),
                ...(tecnico_responsavel_id && { tecnico_responsavel_id })
            }
        });
        if (!atualiza_distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
    async mudarAdministrativoResponsavel(inicial_id, administrativo_responsavel_id) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: inicial_id }
        });
        if (!distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: {
                administrativo_responsavel_id
            }
        });
        if (!atualiza_distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
    async mudarTecnicoResponsavel(inicial_id, tecnico_responsavel_id) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: inicial_id }
        });
        if (!distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: { tecnico_responsavel_id }
        });
        if (!atualiza_distribuicao)
            throw new ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
}
