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
exports.AlvaraTipoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
let AlvaraTipoService = class AlvaraTipoService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async verificaSeExiste(nome, id) {
        const alvara_tipo = await this.prisma.alvara_Tipo.findFirst({
            where: { nome },
        });
        if (id && alvara_tipo && alvara_tipo.id != id)
            throw new common_1.ForbiddenException('Tipo de alvará já cadastrado');
        if (alvara_tipo)
            throw new common_1.ForbiddenException('Tipo de alvará já cadastrado');
    }
    async criar(createAlvaraTipoDto) {
        await this.verificaSeExiste(createAlvaraTipoDto.nome);
        const novo_alvara_tipo = await this.prisma.alvara_Tipo.create({
            data: { ...createAlvaraTipoDto },
        });
        if (!novo_alvara_tipo)
            throw new common_1.ForbiddenException('Erro ao criar tipo de alvará');
        return novo_alvara_tipo;
    }
    async listaCompleta() {
        const tipos = await this.prisma.alvara_Tipo.findMany({
            where: { status: 1 }
        });
        if (!tipos)
            throw new common_1.ForbiddenException('Não foi possível listar os tipos de alvará.');
        return tipos;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca ?
                {
                    OR: [
                        { nome: { contains: busca } }
                    ]
                } : {}),
        };
        const total = await this.prisma.alvara_Tipo.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const alvara_tipos = await this.prisma.alvara_Tipo.findMany({
            where: searchParams,
            orderBy: { criado_em: 'desc' },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        if (!alvara_tipos)
            throw new common_1.ForbiddenException('Nenhum tipo de alvará encontrado');
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: alvara_tipos,
        };
    }
    async buscarPorId(id) {
        const alvara_tipo = await this.prisma.alvara_Tipo.findFirst({
            where: { id },
        });
        if (!alvara_tipo)
            throw new common_1.ForbiddenException('Tipo de alvará não encontrado');
        return alvara_tipo;
    }
    async atualizar(id, updateAlvaraTipoDto) {
        const alvara_tipo = await this.prisma.alvara_Tipo.findFirst({
            where: { id },
        });
        if (!alvara_tipo)
            throw new common_1.ForbiddenException('Tipo de alvará não encontrado');
        const alvara_tipo_atualizado = await this.prisma.alvara_Tipo.update({
            where: { id },
            data: { ...updateAlvaraTipoDto },
        });
        if (!alvara_tipo_atualizado)
            throw new common_1.ForbiddenException('Erro ao atualizar tipo de alvará');
        return alvara_tipo_atualizado;
    }
    async alterarStatus(id, status) {
        const alvaraTipo = await this.prisma.alvara_Tipo.findFirst({
            where: { id },
        });
        if (!alvaraTipo)
            throw new common_1.ForbiddenException('Tipo de alvara não encontrado');
        const alvaraTipo_alterado = await this.prisma.alvara_Tipo.update({
            where: { id },
            data: { status },
        });
        if (!alvaraTipo_alterado)
            throw new common_1.ForbiddenException('Erro ao alterar status do tipo de alvara');
        return alvaraTipo_alterado;
    }
};
exports.AlvaraTipoService = AlvaraTipoService;
exports.AlvaraTipoService = AlvaraTipoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService])
], AlvaraTipoService);
//# sourceMappingURL=alvara-tipo.service.js.map