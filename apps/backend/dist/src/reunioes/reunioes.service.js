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
exports.ReunioesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReunioesService = class ReunioesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listaCompleta() {
        const lista = await this.prisma.reuniao_Processo.findMany({
            orderBy: { data_reuniao: 'asc' }
        });
        if (!lista || lista.length == 0)
            throw new common_1.ForbiddenException('Nenhuma subprefeitura encontrada');
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
            throw new common_1.ForbiddenException('Nenhuma reunião encontrada para o mês/ano especificado.');
        return reunioes;
    }
    async buscarPorId(idInt) {
        let id = idInt.toString();
        const reuniao_Processo = await this.prisma.reuniao_Processo.findUnique({ where: { id } });
        if (!reuniao_Processo)
            throw new common_1.ForbiddenException('reuniao não encontrada.');
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
            throw new common_1.ForbiddenException('Nenhuma reunião encontrada para a data especificada.');
        return reunioes;
    }
};
exports.ReunioesService = ReunioesService;
exports.ReunioesService = ReunioesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReunioesService);
//# sourceMappingURL=reunioes.service.js.map