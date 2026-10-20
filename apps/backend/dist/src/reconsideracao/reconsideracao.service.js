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
exports.ReconsideracaoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const inicial_service_1 = require("../inicial/inicial.service");
let ReconsideracaoService = class ReconsideracaoService {
    constructor(prisma, inicialService) {
        this.prisma = prisma;
        this.inicialService = inicialService;
    }
    parseData(valor) {
        if (valor == null)
            return undefined;
        if (valor instanceof Date)
            return valor;
        const texto = String(valor).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
            return new Date(`${texto}T12:00:00.000Z`);
        }
        const data = new Date(texto);
        if (Number.isNaN(data.getTime())) {
            throw new common_1.BadRequestException('Data inválida.');
        }
        return data;
    }
    async registrarPedido(inicialId, dto) {
        const adm = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: inicialId },
        });
        if (!adm)
            throw new common_1.ForbiddenException('Admissibilidade não encontrada.');
        if (adm.status !== 3) {
            throw new common_1.BadRequestException('Pedido de reconsideração só para processos em reconsideração.');
        }
        await this.prisma.reconsideracao_Admissibilidade.upsert({
            where: { inicial_id: inicialId },
            create: {
                inicial_id: inicialId,
                pedido_reconsideracao: this.parseData(dto.pedido_reconsideracao),
                envio: this.parseData(dto.envio),
                publicacao: this.parseData(dto.publicacao),
                parecer: false,
            },
            update: {
                pedido_reconsideracao: this.parseData(dto.pedido_reconsideracao),
                envio: this.parseData(dto.envio),
                publicacao: this.parseData(dto.publicacao),
            },
        });
        await this.prisma.admissibilidade.update({
            where: { inicial_id: inicialId },
            data: { reconsiderado: true },
        });
        return { mensagem: 'Pedido de reconsideração registrado.' };
    }
    async aceitar(inicialId) {
        const adm = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: inicialId },
            include: { inicial: true },
        });
        if (!adm)
            throw new common_1.ForbiddenException('Admissibilidade não encontrada.');
        if (adm.status !== 3) {
            throw new common_1.BadRequestException('Processo não está em reconsideração.');
        }
        await this.prisma.admissibilidade.update({
            where: { inicial_id: inicialId },
            data: { status: 0 },
        });
        await this.prisma.reconsideracao_Admissibilidade.updateMany({
            where: { inicial_id: inicialId },
            data: { parecer: true },
        });
        const tipoProcesso = adm.inicial.tipo_processo ?? 1;
        await this.inicialService.atualizar(inicialId, {
            status: 2,
            etapa_analise: 1,
            substatus_analise: tipoProcesso === 2 ? 3 : 0,
            tipo_processo: tipoProcesso,
        });
        return {
            mensagem: 'Reconsideração aceita. Processo em análise técnica.',
        };
    }
    async rejeitar(inicialId) {
        const adm = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: inicialId },
        });
        if (!adm)
            throw new common_1.ForbiddenException('Admissibilidade não encontrada.');
        if (adm.status !== 3) {
            throw new common_1.BadRequestException('Processo não está em reconsideração.');
        }
        await this.prisma.admissibilidade.update({
            where: { inicial_id: inicialId },
            data: { status: 2 },
        });
        await this.prisma.inicial.update({
            where: { id: inicialId },
            data: { status: 1 },
        });
        return {
            mensagem: 'Reconsideração rejeitada. Processo encerrado por via ordinária.',
        };
    }
    async buscar(inicialId) {
        return this.prisma.reconsideracao_Admissibilidade.findUnique({
            where: { inicial_id: inicialId },
        });
    }
};
exports.ReconsideracaoService = ReconsideracaoService;
exports.ReconsideracaoService = ReconsideracaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inicial_service_1.InicialService])
], ReconsideracaoService);
//# sourceMappingURL=reconsideracao.service.js.map