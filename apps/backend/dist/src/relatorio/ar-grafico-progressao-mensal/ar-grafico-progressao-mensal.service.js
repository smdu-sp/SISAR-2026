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
exports.ArGraficoProgressaoMensalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ArGraficoProgressaoMensalService = class ArGraficoProgressaoMensalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllByYear(year) {
        return this.getByYearRange(year, year);
    }
    async getByYearRange(anoInicial, anoFinal) {
        const inicio = this.normalizarAno(anoInicial, 'anoInicial');
        const fim = this.normalizarAno(anoFinal, 'anoFinal');
        if (inicio > fim) {
            throw new common_1.BadRequestException('Ano inicial não pode ser maior que o ano final.');
        }
        const dataInicio = new Date(inicio, 0, 1);
        const dataFim = new Date(fim + 1, 0, 1);
        const admissibilidades = await this.prisma.admissibilidade.findMany({
            where: {
                criado_em: {
                    gte: dataInicio,
                    lt: dataFim,
                },
            },
            select: {
                criado_em: true,
            },
            orderBy: {
                criado_em: 'asc',
            },
        });
        const porAno = new Map();
        for (let ano = inicio; ano <= fim; ano++) {
            porAno.set(ano, Array(12).fill(0));
        }
        for (const admissibilidade of admissibilidades) {
            const data = admissibilidade.criado_em;
            const ano = data.getFullYear();
            const mes = data.getMonth();
            const mensal = porAno.get(ano);
            if (mensal) {
                mensal[mes] += 1;
            }
        }
        const resultado = Array.from(porAno.entries()).map(([ano, mes]) => {
            let acumulado = 0;
            const acc = mes.map((totalMes) => {
                acumulado += totalMes;
                return acumulado;
            });
            return { ano, mes, acc };
        });
        return resultado;
    }
    normalizarAno(valor, nomeCampo) {
        const ano = Number(valor);
        if (!Number.isInteger(ano) || ano < 1900 || ano > 3000) {
            throw new common_1.BadRequestException(`${nomeCampo} inválido.`);
        }
        return ano;
    }
};
exports.ArGraficoProgressaoMensalService = ArGraficoProgressaoMensalService;
exports.ArGraficoProgressaoMensalService = ArGraficoProgressaoMensalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArGraficoProgressaoMensalService);
//# sourceMappingURL=ar-grafico-progressao-mensal.service.js.map