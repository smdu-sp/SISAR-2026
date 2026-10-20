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
exports.ParecerAdmissibilidadeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
let ParecerAdmissibilidadeService = class ParecerAdmissibilidadeService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async criar(createParecerAdmissibilidadeDto) {
        const { parecer, status } = createParecerAdmissibilidadeDto;
        const parecerAdmissibilidadeTexto = await this.prisma.parecer_Admissibilidade.findFirst({
            where: { parecer }
        });
        if (parecerAdmissibilidadeTexto)
            throw new common_1.BadRequestException('Parecer ja cadastrado.');
        const parecerAdmissibilidade = await this.prisma.parecer_Admissibilidade.create({
            data: { parecer, status }
        });
        if (!parecerAdmissibilidade)
            throw new common_1.InternalServerErrorException('Não foi possível criar o parecer. Tente novamente.');
        return parecerAdmissibilidade;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca && { OR: [
                    { parecer: { contains: busca } },
                ] })
        };
        const total = await this.prisma.parecer_Admissibilidade.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const pareceresAdmissibilidade = await this.prisma.parecer_Admissibilidade.findMany({
            where: searchParams,
            orderBy: { parecer: 'asc' },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: pareceresAdmissibilidade,
        };
    }
    async buscarPorId(id) {
        if (!id && id === "")
            throw new common_1.BadRequestException('Id inválido.');
        const parecerAdmissibilidade = await this.prisma.parecer_Admissibilidade.findUnique({
            where: { id }
        });
        if (!parecerAdmissibilidade)
            throw new common_1.BadRequestException('Parecer não encontrado.');
        return parecerAdmissibilidade;
    }
    async atualizar(id, updateParecerAdmissibilidadeDto) {
        if (!id && id === "")
            throw new common_1.BadRequestException('Id inválido.');
        const parecerAdmissibilidade = await this.prisma.parecer_Admissibilidade.findUnique({
            where: { id }
        });
        if (!parecerAdmissibilidade)
            throw new common_1.BadRequestException('Parecer não encontrado.');
        const parecerAdmissibilidadeAtualizado = await this.prisma.parecer_Admissibilidade.update({
            where: { id },
            data: { ...updateParecerAdmissibilidadeDto }
        });
        if (!parecerAdmissibilidadeAtualizado)
            throw new common_1.InternalServerErrorException('Não foi possível atualizar o parecer. Tente novamente.');
        return parecerAdmissibilidadeAtualizado;
    }
    async desativar(id) {
        if (!id && id === "")
            throw new common_1.BadRequestException('Id inválido.');
        const parecerAdmissibilidade = await this.prisma.parecer_Admissibilidade.findUnique({
            where: { id }
        });
        if (!parecerAdmissibilidade)
            throw new common_1.BadRequestException('Parecer não encontrado.');
        const parecerAdmissibilidadeDesativado = await this.prisma.parecer_Admissibilidade.update({
            where: { id },
            data: {
                status: parecerAdmissibilidade.status === 1 ? 0 : 1
            }
        });
        if (!parecerAdmissibilidadeDesativado)
            throw new common_1.InternalServerErrorException('Não foi possível desativar o parecer. Tente novamente.');
        return parecerAdmissibilidadeDesativado;
    }
};
exports.ParecerAdmissibilidadeService = ParecerAdmissibilidadeService;
exports.ParecerAdmissibilidadeService = ParecerAdmissibilidadeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService])
], ParecerAdmissibilidadeService);
//# sourceMappingURL=parecer_admissibilidade.service.js.map