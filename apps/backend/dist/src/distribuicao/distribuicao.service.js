"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistribuicaoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DistribuicaoService = class DistribuicaoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(createDistribuicaoDto) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: createDistribuicaoDto.inicial_id }
        });
        if (distribuicao)
            throw new common_1.ForbiddenException('Erro ao criar distribuição. Processo já foi alocado.');
        const nova_distribuicao = await this.prisma.distribuicao.create({
            data: createDistribuicaoDto
        });
        if (!nova_distribuicao)
            throw new common_1.ForbiddenException('Erro ao criar distribuição. Tente novamente.');
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
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const { administrativo_responsavel_id, tecnico_responsavel_id } = updateDistribuicaoDto;
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: {
                ...(administrativo_responsavel_id && { administrativo_responsavel_id }),
                ...(tecnico_responsavel_id && { tecnico_responsavel_id })
            }
        });
        if (!atualiza_distribuicao)
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
    async mudarAdministrativoResponsavel(inicial_id, administrativo_responsavel_id) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: inicial_id }
        });
        if (!distribuicao)
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: {
                administrativo_responsavel_id
            }
        });
        if (!atualiza_distribuicao)
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
    async mudarTecnicoResponsavel(inicial_id, tecnico_responsavel_id) {
        const distribuicao = await this.prisma.distribuicao.findUnique({
            where: { inicial_id: inicial_id }
        });
        if (!distribuicao)
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Processo não existe.');
        const atualiza_distribuicao = await this.prisma.distribuicao.update({
            where: { inicial_id },
            data: { tecnico_responsavel_id }
        });
        if (!atualiza_distribuicao)
            throw new common_1.ForbiddenException('Erro ao atualizar distribuição. Tente novamente.');
        return atualiza_distribuicao;
    }
};
exports.DistribuicaoService = DistribuicaoService;
exports.DistribuicaoService = DistribuicaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DistribuicaoService);
//# sourceMappingURL=distribuicao.service.js.map