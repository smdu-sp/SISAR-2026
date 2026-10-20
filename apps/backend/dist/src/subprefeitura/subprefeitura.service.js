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
exports.SubprefeituraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
let SubprefeituraService = class SubprefeituraService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async listaCompleta() {
        const lista = await this.prisma.subprefeitura.findMany({
            orderBy: { nome: 'asc' }
        });
        return lista;
    }
    async buscaPorNome(nome) {
        const subprefeitura = await this.prisma.subprefeitura.findUnique({
            where: { nome }
        });
        return subprefeitura;
    }
    async criar(createsubprefeituraDto) {
        const { nome, sigla, status } = createsubprefeituraDto;
        if (await this.buscaPorNome(nome))
            throw new common_1.ForbiddenException('Ja existe uma subprefeitura com o mesmo nome');
        const novasubprefeitura = await this.prisma.subprefeitura.create({
            data: { nome, sigla, status }
        });
        if (!novasubprefeitura)
            throw new common_1.InternalServerErrorException('Não foi possível criar a subprefeitura. Tente novamente.');
        return novasubprefeitura;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca ?
                { OR: [
                        { nome: { contains: busca } },
                        { sigla: { contains: busca } },
                    ] } :
                {}),
        };
        const total = await this.prisma.subprefeitura.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const subprefeituras = await this.prisma.subprefeitura.findMany({
            where: searchParams,
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: subprefeituras
        };
    }
    async buscarPorId(id) {
        const subprefeitura = await this.prisma.subprefeitura.findUnique({
            where: { id }
        });
        if (!subprefeitura)
            throw new common_1.ForbiddenException('subprefeitura não encontrada.');
        return subprefeitura;
    }
    async atualizar(id, updatesubprefeituraDto) {
        const { nome } = updatesubprefeituraDto;
        const subprefeitura = await this.prisma.subprefeitura.findUnique({
            where: { id }
        });
        if (!subprefeitura)
            throw new common_1.ForbiddenException('subprefeitura não encontrada.');
        if (nome) {
            const subprefeituraNome = await this.buscaPorNome(nome);
            if (subprefeituraNome && subprefeituraNome.id != id)
                throw new common_1.ForbiddenException('Já existe uma subprefeitura com o mesmo nome.');
        }
        const updatedsubprefeitura = await this.prisma.subprefeitura.update({
            where: { id },
            data: updatesubprefeituraDto
        });
        if (!updatedsubprefeitura)
            throw new common_1.InternalServerErrorException('Não foi possível atualizar a subprefeitura. Tente novamente.');
        return updatedsubprefeitura;
    }
    async desativar(id) {
        const unidade = await this.prisma.unidade.findUnique({ where: { id } });
        if (!unidade)
            throw new common_1.ForbiddenException('Unidade não encontrada.');
        const updatedUnidade = await this.prisma.unidade.update({
            where: { id },
            data: { status: 0 }
        });
        if (!updatedUnidade)
            throw new common_1.InternalServerErrorException('Não foi possível desativar a unidade. Tente novamente.');
        return {
            message: 'Unidade desativada com sucesso.'
        };
    }
};
exports.SubprefeituraService = SubprefeituraService;
exports.SubprefeituraService = SubprefeituraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService])
], SubprefeituraService);
//# sourceMappingURL=subprefeitura.service.js.map