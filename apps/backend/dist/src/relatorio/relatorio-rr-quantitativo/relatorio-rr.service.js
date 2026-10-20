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
exports.RelatorioRRService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RelatorioRRService = class RelatorioRRService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUnidades() {
        return await this.prisma.unidade.findMany({
            where: { status: 1 },
            select: { id: true, nome: true }
        });
    }
    async countByUnidade(status, tipo, unidadeIds, periodFilter) {
        const resultados = await this.prisma.admissibilidade.findMany({
            where: {
                inicial: { status, tipo_processo: tipo },
                data_decisao_interlocutoria: periodFilter,
                unidade_id: { in: unidadeIds }
            },
            select: { unidade: { select: { nome: true, id: true } } }
        });
        return resultados.reduce((acc, item) => {
            const nome = item.unidade.nome;
            acc[nome] = (acc[nome] || 0) + 1;
            return acc;
        }, {});
    }
    ;
    async countTotal(status, decisaoNull = false, periodFilter) {
        return await this.prisma.admissibilidade.count({
            where: {
                status,
                criado_em: periodFilter,
                data_decisao_interlocutoria: decisaoNull ? null : periodFilter
            }
        });
    }
    ;
    async getData(status, decisaoNull = false, periodFilter) {
        return await this.prisma.admissibilidade.findMany({
            where: {
                status,
                criado_em: periodFilter,
                data_decisao_interlocutoria: decisaoNull ? null : periodFilter
            },
            include: { inicial: true }
        });
    }
    ;
    async getRelatorio(mes, ano) {
        const primeiroDia = new Date(Number(ano), Number(mes) - 1, 1);
        const ultimoDia = new Date(Number(ano), Number(mes), 0);
        const unidades = await this.getUnidades();
        const periodFilter = { gte: primeiroDia, lte: ultimoDia };
        const unidadeIds = unidades.map(u => u.id);
        const analise = await this.countTotal(1, true, periodFilter);
        const inadmissiveis = await this.countTotal(2, true, periodFilter);
        const admissiveis = await this.countTotal(0, null, periodFilter);
        const analiseGeralSmul = await this.countByUnidade(2, 1, unidadeIds, periodFilter);
        const deferidoGeralSmul = await this.countByUnidade(3, 1, unidadeIds, periodFilter);
        const indeferidosGeralSmul = await this.countByUnidade(4, 1, unidadeIds, periodFilter);
        const analiseGeralGrap = await this.countByUnidade(2, 2, unidadeIds, periodFilter);
        const deferidoGeralGrap = await this.countByUnidade(3, 2, unidadeIds, periodFilter);
        const indeferidosGeralGrap = await this.countByUnidade(4, 2, unidadeIds, periodFilter);
        const data_gerado = new Date().toISOString().split("T")[0].replaceAll("-", "/").split('/').reverse().join('/');
        return {
            "total": (analise + inadmissiveis + admissiveis),
            "analise": analise,
            "inadmissiveis": inadmissiveis,
            "admissiveis": admissiveis,
            "data_gerado": data_gerado,
            "em_analise": {
                "smul": {
                    "quantidade": Object.values(analiseGeralSmul).reduce((a, b) => a + b, 0),
                    "data": analiseGeralSmul
                },
                "graproem": {
                    "quantidade": Object.values(analiseGeralGrap).reduce((a, b) => a + b, 0),
                    "data": analiseGeralGrap
                }
            },
            "deferidos": {
                "smul": {
                    "quantidade": Object.values(deferidoGeralSmul).reduce((a, b) => a + b, 0),
                    "data": deferidoGeralSmul
                },
                "graproem": {
                    "quantidade": Object.values(deferidoGeralGrap).reduce((a, b) => a + b, 0),
                    "data": deferidoGeralGrap
                }
            },
            "indeferidos": {
                "smul": {
                    "quantidade": Object.values(indeferidosGeralSmul).reduce((a, b) => a + b, 0),
                    "data": indeferidosGeralSmul
                },
                "graproem": {
                    "quantidade": Object.values(indeferidosGeralGrap).reduce((a, b) => a + b, 0),
                    "data": indeferidosGeralGrap
                }
            },
            "inadmissiveis_dados": await this.getData(2, true, periodFilter),
            "admissiveis_dados": await this.getData(0, null, periodFilter),
            "em_analise_dados": await this.getData(1, true, periodFilter)
        };
    }
};
exports.RelatorioRRService = RelatorioRRService;
exports.RelatorioRRService = RelatorioRRService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatorioRRService);
//# sourceMappingURL=relatorio-rr.service.js.map