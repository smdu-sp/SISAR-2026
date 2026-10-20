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
exports.AvisosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AvisosService = class AvisosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAvisoDto, usuario_id) {
        let { titulo, descricao, data, inicial_id } = createAvisoDto;
        const criar = await this.prisma.avisos.create({
            data: { titulo, descricao, data, usuario_id, inicial_id }
        });
        if (!criar)
            throw new common_1.InternalServerErrorException('Não foi possível criar o aviso. Tente novamente.');
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
            throw new common_1.InternalServerErrorException('Nenhuma reunião encontrada para a data especificada.');
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
            throw new common_1.InternalServerErrorException('Nenhuma reunião encontrada para o mês/ano especificado.');
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
};
exports.AvisosService = AvisosService;
exports.AvisosService = AvisosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvisosService);
//# sourceMappingURL=avisos.service.js.map