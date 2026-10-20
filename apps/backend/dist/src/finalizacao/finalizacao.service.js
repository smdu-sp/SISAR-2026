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
exports.FinalizacaoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
let FinalizacaoService = class FinalizacaoService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    parseDataCampo(valor) {
        if (valor == null || valor === '') {
            throw new common_1.BadRequestException('Data inválida.');
        }
        if (valor instanceof Date)
            return valor;
        const texto = String(valor).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto))
            return new Date(`${texto}T12:00:00.000Z`);
        const data = new Date(texto);
        if (Number.isNaN(data.getTime()))
            throw new common_1.BadRequestException('Data inválida.');
        return data;
    }
    async criar(createFinalizacaoDto) {
        let { inicial_id, data_apostilamento, data_conclusao, data_emissao, data_outorga, data_resposta, data_termo, num_alvara, obs, outorga } = createFinalizacaoDto;
        data_apostilamento = this.parseDataCampo(data_apostilamento);
        data_conclusao = this.parseDataCampo(data_conclusao);
        data_emissao = this.parseDataCampo(data_emissao);
        data_outorga = this.parseDataCampo(data_outorga);
        data_resposta = this.parseDataCampo(data_resposta);
        data_termo = this.parseDataCampo(data_termo);
        const inicial = await this.prisma.inicial.findUnique({ where: { id: inicial_id } });
        if (!inicial)
            throw new common_1.InternalServerErrorException('Processo não encontrado');
        if (inicial.status !== 3) {
            throw new common_1.InternalServerErrorException('Finalização só é permitida para processos deferidos na análise técnica.');
        }
        const existente = await this.prisma.conclusao.findUnique({
            where: { inicial_id },
        });
        if (existente) {
            throw new common_1.InternalServerErrorException('Este processo já possui registro de finalização.');
        }
        const criar = await this.prisma.conclusao.create({
            data: { inicial_id, data_apostilamento, data_conclusao, data_emissao, data_outorga, data_resposta, data_termo, num_alvara, obs, outorga }
        });
        if (!criar)
            throw new common_1.InternalServerErrorException('Erro ao criar a finalização');
        return criar;
    }
    async buscarTudo(pagina = 1, limite = 10, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca ?
                {
                    OR: [
                        { obs: { contains: busca } },
                    ]
                } :
                {})
        };
        const total = await this.prisma.conclusao.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const iniciais = await this.prisma.conclusao.findMany({
            where: searchParams,
            include: { inicial: true },
            skip: (pagina - 1) * limite,
            take: limite
        });
        if (!iniciais)
            throw new common_1.InternalServerErrorException('Nenhum processo encontrado');
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: iniciais,
        };
    }
    async buscaId(id) {
        const buscaId = await this.prisma.conclusao.findUnique({
            where: { inicial_id: id }
        });
        if (!buscaId)
            throw new common_1.InternalServerErrorException('Processo não encontrado');
        return buscaId;
    }
    async atualizar(id, updateFinalizacaoDto) {
        let { inicial_id, data_apostilamento, data_conclusao, data_emissao, data_outorga, data_resposta, data_termo, num_alvara, obs, outorga } = updateFinalizacaoDto;
        if (data_apostilamento != null)
            data_apostilamento = this.parseDataCampo(data_apostilamento);
        if (data_conclusao != null)
            data_conclusao = this.parseDataCampo(data_conclusao);
        if (data_emissao != null)
            data_emissao = this.parseDataCampo(data_emissao);
        if (data_outorga != null)
            data_outorga = this.parseDataCampo(data_outorga);
        if (data_resposta != null)
            data_resposta = this.parseDataCampo(data_resposta);
        if (data_termo != null)
            data_termo = this.parseDataCampo(data_termo);
        const atualizar = await this.prisma.conclusao.update({
            where: { inicial_id: id },
            data: { inicial_id, data_apostilamento, data_conclusao, data_emissao, data_outorga, data_resposta, data_termo, num_alvara, obs, outorga }
        });
        if (!atualizar)
            throw new common_1.InternalServerErrorException('Não foi possivel atualizar o processo finalizado');
        return atualizar;
    }
};
exports.FinalizacaoService = FinalizacaoService;
exports.FinalizacaoService = FinalizacaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, app_service_1.AppService])
], FinalizacaoService);
//# sourceMappingURL=finalizacao.service.js.map