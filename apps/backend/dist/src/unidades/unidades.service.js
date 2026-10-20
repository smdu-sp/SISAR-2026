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
exports.UnidadesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
const client_1 = require("@prisma/client");
const NIVEL_PAI = {
    COORDENADORIA: null,
    DIRETORIA: client_1.Nivel_Unidade.COORDENADORIA,
    UNIDADE: client_1.Nivel_Unidade.DIRETORIA,
};
let UnidadesService = class UnidadesService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async listaCompleta(nivel) {
        return await this.prisma.unidade.findMany({
            where: { ...(nivel ? { nivel } : {}) },
            orderBy: { nome: 'asc' }
        });
    }
    async arvore(busca) {
        const todas = await this.prisma.unidade.findMany({
            orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
        });
        const filtro = busca?.trim().toLowerCase();
        const combina = (u) => !filtro ||
            [u.nome, u.sigla, u.codigo].some((c) => c?.toLowerCase().includes(filtro));
        const porPai = new Map();
        for (const u of todas) {
            const chave = u.unidade_pai_id ?? null;
            if (!porPai.has(chave))
                porPai.set(chave, []);
            porPai.get(chave).push({ ...u, filhas: [] });
        }
        const montar = (paiId) => (porPai.get(paiId) ?? []).map((no) => ({
            ...no,
            filhas: montar(no.id),
        }));
        const podar = (nos) => nos
            .map((no) => ({ ...no, filhas: podar(no.filhas) }))
            .filter((no) => combina(no) || no.filhas.length > 0);
        const arvore = montar(null);
        return filtro ? podar(arvore) : arvore;
    }
    async buscaPorCodigo(codigo) {
        return await this.prisma.unidade.findFirst({ where: { codigo } });
    }
    async buscaPorSigla(sigla) {
        return await this.prisma.unidade.findFirst({ where: { sigla } });
    }
    async buscaPorNome(nome, nivel) {
        return await this.prisma.unidade.findFirst({
            where: { nome, ...(nivel ? { nivel } : {}) },
        });
    }
    async validarHierarquia(nivel, unidade_pai_id) {
        const paiEsperado = NIVEL_PAI[nivel];
        if (!unidade_pai_id) {
            if (paiEsperado)
                throw new common_1.ForbiddenException(`Unidade de nível ${nivel} precisa estar vinculada a uma unidade ${paiEsperado.toLowerCase()}.`);
            return;
        }
        if (!paiEsperado)
            throw new common_1.ForbiddenException('Coordenadoria não pode ter unidade pai.');
        const pai = await this.prisma.unidade.findUnique({ where: { id: unidade_pai_id } });
        if (!pai)
            throw new common_1.ForbiddenException('Unidade pai não encontrada.');
        if (pai.nivel !== paiEsperado)
            throw new common_1.ForbiddenException(`Unidade de nível ${nivel} deve ter como pai uma unidade ${paiEsperado.toLowerCase()}.`);
    }
    async criar(createUnidadeDto) {
        const { nome, sigla, codigo, status, nivel, unidade_pai_id } = createUnidadeDto;
        await this.validarHierarquia(nivel, unidade_pai_id);
        if (await this.buscaPorNome(nome, nivel))
            throw new common_1.ForbiddenException(`Já existe uma unidade de mesmo nível com o nome (${nome}).`);
        if (codigo && await this.buscaPorCodigo(codigo))
            throw new common_1.ForbiddenException(`Já existe uma unidade com o mesmo código (${codigo}).`);
        if (sigla && await this.buscaPorSigla(sigla))
            throw new common_1.ForbiddenException(`Já existe uma unidade com a mesma sigla (${sigla}).`);
        const novaUnidade = await this.prisma.unidade.create({
            data: {
                nome,
                sigla: sigla || null,
                codigo: codigo || null,
                status: status ?? 1,
                nivel,
                unidade_pai_id: unidade_pai_id || null,
            }
        });
        if (!novaUnidade)
            throw new common_1.InternalServerErrorException('Não foi possível criar a unidade. Tente novamente.');
        return novaUnidade;
    }
    async buscarTudo(pagina = 1, limite = 10, busca, filtro, nivel) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca ?
                {
                    OR: [
                        { nome: { contains: busca } },
                        { sigla: { contains: busca } },
                        { codigo: { contains: busca } }
                    ]
                } :
                {}),
            ...(nivel ? { nivel } : {}),
        };
        const total = await this.prisma.unidade.count({ where: searchParams });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const unidades = await this.prisma.unidade.findMany({
            where: {
                AND: [
                    searchParams,
                    { status: filtro < 0 || !filtro && filtro !== 0 ? undefined : filtro },
                ]
            },
            include: { unidade_pai: { select: { id: true, nome: true, sigla: true, nivel: true } } },
            orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
            skip: (pagina - 1) * limite,
            take: limite,
        });
        return {
            total: +total,
            pagina: +pagina,
            limite: +limite,
            data: unidades
        };
    }
    async buscarPorId(id) {
        return await this.prisma.unidade.findUnique({ where: { id } });
    }
    async atualizar(id, updateUnidadeDto) {
        const { nome, sigla, codigo, nivel, unidade_pai_id } = updateUnidadeDto;
        const unidade = await this.prisma.unidade.findUnique({ where: { id } });
        if (!unidade)
            throw new common_1.ForbiddenException('Unidade não encontrada.');
        const nivelFinal = nivel ?? unidade.nivel;
        if (nivel !== undefined || unidade_pai_id !== undefined) {
            const paiFinal = unidade_pai_id !== undefined ? unidade_pai_id : unidade.unidade_pai_id;
            if (paiFinal === id)
                throw new common_1.ForbiddenException('Uma unidade não pode ser pai de si mesma.');
            await this.validarHierarquia(nivelFinal, paiFinal || undefined);
        }
        if (nome) {
            const unidadeNome = await this.buscaPorNome(nome, nivelFinal);
            if (unidadeNome && unidadeNome.id != id)
                throw new common_1.ForbiddenException(`Já existe uma unidade de mesmo nível com o nome (${nome}).`);
        }
        if (sigla) {
            const unidadeSigla = await this.buscaPorSigla(sigla);
            if (unidadeSigla && unidadeSigla.id != id)
                throw new common_1.ForbiddenException(`Já existe uma unidade com a mesma sigla (${sigla}).`);
        }
        if (codigo) {
            const unidadeCodigo = await this.buscaPorCodigo(codigo);
            if (unidadeCodigo && unidadeCodigo.id != id)
                throw new common_1.ForbiddenException(`Já existe uma unidade com o mesmo código (${codigo}).`);
        }
        const updatedUnidade = await this.prisma.unidade.update({
            where: { id },
            data: {
                ...updateUnidadeDto,
                ...(sigla !== undefined ? { sigla: sigla || null } : {}),
                ...(codigo !== undefined ? { codigo: codigo || null } : {}),
                ...(unidade_pai_id !== undefined ? { unidade_pai_id: unidade_pai_id || null } : {}),
            }
        });
        if (!updatedUnidade)
            throw new common_1.InternalServerErrorException('Não foi possível atualizar a unidade. Tente novamente.');
        return updatedUnidade;
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
exports.UnidadesService = UnidadesService;
exports.UnidadesService = UnidadesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_service_1.AppService])
], UnidadesService);
//# sourceMappingURL=unidades.service.js.map