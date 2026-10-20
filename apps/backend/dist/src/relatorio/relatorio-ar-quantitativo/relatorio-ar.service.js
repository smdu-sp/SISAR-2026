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
exports.RelatorioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RelatorioService = class RelatorioService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUnidades() {
        return await this.prisma.unidade.findMany({
            where: { status: 1 },
            select: { id: true, nome: true },
        });
    }
    async countByUnidade(status, periodFilter, unidadeId, tipo_processo) {
        let resultados;
        if (!periodFilter) {
            periodFilter = {
                gte: new Date("1970-01-01T00:00:00.000Z"),
                lte: new Date(),
            };
        }
        if (tipo_processo === 1 || tipo_processo === 2) {
            const unidadeNome = tipo_processo === 1 ? "SMUL" : "GRAPROEM";
            const processos = await this.prisma.admissibilidade.count({
                where: {
                    inicial: {
                        status,
                        tipo_processo,
                    },
                    data_decisao_interlocutoria: periodFilter,
                },
            });
            return { [unidadeNome]: processos };
        }
        else {
            if (!unidadeId)
                return {};
            resultados = await this.prisma.admissibilidade.findMany({
                where: {
                    inicial: {
                        status,
                        tipo_processo: { in: [1, 2] },
                    },
                    data_decisao_interlocutoria: periodFilter,
                    unidade_id: unidadeId,
                },
                select: { unidade: { select: { nome: true, id: true } } },
            });
            return resultados.reduce((acc, item) => {
                const nome = item.unidade.nome;
                acc[nome] = (acc[nome] || 0) + 1;
                return acc;
            }, {});
        }
    }
    async getIdByUnidade(sigla) {
        const unidade = await this.prisma.unidade.findFirst({
            where: {
                sigla
            }
        });
        return unidade?.id ?? null;
    }
    async countTotal(status, decisaoNull = false, periodFilter) {
        return await this.prisma.admissibilidade.count({
            where: {
                status,
                criado_em: periodFilter,
                data_decisao_interlocutoria: decisaoNull ? null : periodFilter,
            },
        });
    }
    async getData(status, decisaoNull = false, periodFilter) {
        return await this.prisma.admissibilidade.findMany({
            where: {
                status,
                criado_em: periodFilter,
                data_decisao_interlocutoria: decisaoNull ? null : periodFilter,
            },
            include: { inicial: true },
        });
    }
    async getInicialData(status, periodFilter) {
        return await this.prisma.inicial.findMany({
            where: {
                status,
                criado_em: periodFilter,
            },
        });
    }
    verificarData(mes, ano) {
        if (!mes && !ano) {
            return {
                gte: new Date(0),
                lte: new Date(),
            };
        }
        const primeiroDia = new Date(Number(ano), Number(mes) - 1, 1);
        const ultimoDia = new Date(Number(ano), Number(mes), 0);
        const periodFilter = { gte: primeiroDia, lte: ultimoDia };
        return periodFilter;
    }
    async getRelatorio(mes, ano) {
        const periodFilter = this.verificarData(mes, ano);
        const analise = (await this.getInicialData(0, periodFilter)).length;
        const inadmissiveis = (await this.getInicialData(1, periodFilter))
            .length;
        const admissiveis = (await this.getInicialData(2, periodFilter))
            .length;
        const analiseGeralSmul = await this.countByUnidade(2, periodFilter, null, 1);
        const deferidoGeralSmul = await this.countByUnidade(3, periodFilter, null, 1);
        const indeferidosGeralSmul = await this.countByUnidade(4, periodFilter, null, 1);
        const analiseGeralGrap = await this.countByUnidade(2, periodFilter, null, 2);
        const deferidoGeralGrap = await this.countByUnidade(3, periodFilter, null, 2);
        const indeferidosGeralGrap = await this.countByUnidade(4, periodFilter, null, 2);
        const analiseGeralParhis = await this.countByUnidade(2, periodFilter, await this.getIdByUnidade("PARHIS"));
        const deferidoGeralParhis = await this.countByUnidade(3, periodFilter, await this.getIdByUnidade("PARHIS"));
        const indeferidosGeralParhis = await this.countByUnidade(4, periodFilter, await this.getIdByUnidade("PARHIS"));
        const analiseGeralResid = await this.countByUnidade(2, periodFilter, await this.getIdByUnidade("RESID"));
        const deferidoGeralResid = await this.countByUnidade(3, periodFilter, await this.getIdByUnidade("RESID"));
        const indeferidosGeralResid = await this.countByUnidade(4, periodFilter, await this.getIdByUnidade("RESID"));
        const analiseGeralServin = await this.countByUnidade(2, periodFilter, await this.getIdByUnidade("SERVIN"));
        const deferidoGeralServin = await this.countByUnidade(3, periodFilter, await this.getIdByUnidade("SERVIN"));
        const indeferidosGeralServin = await this.countByUnidade(4, periodFilter, await this.getIdByUnidade("SERVIN"));
        const analiseGeralComin = await this.countByUnidade(2, periodFilter, await this.getIdByUnidade("COMIN"));
        const deferidoGeralComin = await this.countByUnidade(3, periodFilter, await this.getIdByUnidade("COMIN"));
        const indeferidosGeralComin = await this.countByUnidade(4, periodFilter, await this.getIdByUnidade("COMIN"));
        const analiseGeralCaepp = await this.countByUnidade(2, periodFilter, await this.getIdByUnidade("CAEPP"));
        const deferidoGeralCaepp = await this.countByUnidade(3, periodFilter, await this.getIdByUnidade("CAEPP"));
        const indeferidosGeralCaepp = await this.countByUnidade(4, periodFilter, await this.getIdByUnidade("CAEPP"));
        const data_gerado = new Date()
            .toISOString()
            .split('T')[0]
            .replaceAll('-', '/')
            .split('/')
            .reverse()
            .join('/');
        return {
            total: analise + inadmissiveis + admissiveis,
            analise: analise,
            inadmissiveis: inadmissiveis,
            admissiveis: admissiveis,
            data_gerado: data_gerado,
            em_analise: {
                smul: {
                    quantidade: Object.values(analiseGeralSmul).reduce((a, b) => a + b, 0),
                    data: analiseGeralSmul,
                },
                graproem: {
                    quantidade: Object.values(analiseGeralGrap).reduce((a, b) => a + b, 0),
                    data: analiseGeralGrap,
                },
                parhis: {
                    quantidade: Object.values(analiseGeralParhis).reduce((a, b) => a + b, 0),
                    data: analiseGeralParhis,
                },
                servin: {
                    quantidade: Object.values(analiseGeralServin).reduce((a, b) => a + b, 0),
                    data: analiseGeralServin,
                },
                comin: {
                    quantidade: Object.values(analiseGeralComin).reduce((a, b) => a + b, 0),
                    data: analiseGeralComin,
                },
                caepp: {
                    quantidade: Object.values(analiseGeralCaepp).reduce((a, b) => a + b, 0),
                    data: analiseGeralCaepp,
                },
                resid: {
                    quantidade: Object.values(analiseGeralResid).reduce((a, b) => a + b, 0),
                    data: analiseGeralResid,
                },
                total_parcial: Object.values(analiseGeralSmul).reduce((a, b) => a + b, 0) +
                    Object.values(analiseGeralGrap).reduce((a, b) => a + b, 0) +
                    Object.values(analiseGeralResid).reduce((a, b) => a + b, 0),
            },
            deferidos: {
                smul: {
                    quantidade: Object.values(deferidoGeralSmul).reduce((a, b) => a + b, 0),
                    data: deferidoGeralSmul,
                },
                graproem: {
                    quantidade: Object.values(deferidoGeralGrap).reduce((a, b) => a + b, 0),
                    data: deferidoGeralGrap,
                },
                parhis: {
                    quantidade: Object.values(deferidoGeralParhis).reduce((a, b) => a + b, 0),
                    data: deferidoGeralParhis,
                },
                servin: {
                    quantidade: Object.values(deferidoGeralServin).reduce((a, b) => a + b, 0),
                    data: deferidoGeralServin,
                },
                comin: {
                    quantidade: Object.values(deferidoGeralComin).reduce((a, b) => a + b, 0),
                    data: deferidoGeralComin,
                },
                caepp: {
                    quantidade: Object.values(deferidoGeralCaepp).reduce((a, b) => a + b, 0),
                    data: deferidoGeralCaepp,
                },
                resid: {
                    quantidade: Object.values(deferidoGeralResid).reduce((a, b) => a + b, 0),
                    data: deferidoGeralResid,
                },
                total_parcial: Object.values(deferidoGeralSmul).reduce((a, b) => a + b, 0) +
                    Object.values(deferidoGeralGrap).reduce((a, b) => a + b, 0) +
                    Object.values(deferidoGeralResid).reduce((a, b) => a + b, 0),
            },
            indeferidos: {
                smul: {
                    quantidade: Object.values(indeferidosGeralSmul).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralSmul,
                },
                graproem: {
                    quantidade: Object.values(indeferidosGeralGrap).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralGrap,
                },
                parhis: {
                    quantidade: Object.values(indeferidosGeralParhis).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralParhis,
                },
                servin: {
                    quantidade: Object.values(indeferidosGeralServin).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralServin,
                },
                comin: {
                    quantidade: Object.values(indeferidosGeralComin).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralComin,
                },
                caepp: {
                    quantidade: Object.values(indeferidosGeralCaepp).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralCaepp,
                },
                resid: {
                    quantidade: Object.values(indeferidosGeralResid).reduce((a, b) => a + b, 0),
                    data: indeferidosGeralResid,
                },
                total_parcial: Object.values(indeferidosGeralSmul).reduce((a, b) => a + b, 0) +
                    Object.values(indeferidosGeralGrap).reduce((a, b) => a + b, 0) +
                    Object.values(indeferidosGeralResid).reduce((a, b) => a + b, 0),
            },
            analise_admissiveis_dados: await this.getInicialData(0, periodFilter),
            inadmissiveis_dados: await this.getInicialData(1, periodFilter),
            em_analise_dados: await this.getInicialData(2, periodFilter),
            deferidos_dados: await this.getInicialData(3, periodFilter),
            indeferidos_dados: await this.getInicialData(4, periodFilter),
            via_ordinaria_dados: await this.getInicialData(5, periodFilter),
        };
    }
};
exports.RelatorioService = RelatorioService;
exports.RelatorioService = RelatorioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatorioService);
//# sourceMappingURL=relatorio-ar.service.js.map