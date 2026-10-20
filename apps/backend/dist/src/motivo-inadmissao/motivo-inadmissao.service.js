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
exports.MotivoInadmissaoService = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
const prisma_service_1 = require("../prisma/prisma.service");
let MotivoInadmissaoService = class MotivoInadmissaoService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async criar(dto) {
        const criado = await this.prisma.motivo_Inadmissao.create({
            data: { descricao: dto.descricao },
        });
        if (!criado) {
            throw new common_1.InternalServerErrorException('Não foi possível criar o motivo.');
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
            throw new common_1.BadRequestException('Id inválido.');
        const item = await this.prisma.motivo_Inadmissao.findUnique({
            where: { id },
        });
        if (!item)
            throw new common_1.BadRequestException('Motivo não encontrado.');
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
};
exports.MotivoInadmissaoService = MotivoInadmissaoService;
exports.MotivoInadmissaoService = MotivoInadmissaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService])
], MotivoInadmissaoService);
//# sourceMappingURL=motivo-inadmissao.service.js.map