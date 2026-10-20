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
exports.PermissoesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const recursos_1 = require("./recursos");
const TTL_CACHE_MS = 30_000;
let PermissoesService = class PermissoesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.cache = null;
        this.cacheExpiraEm = 0;
    }
    async onModuleInit() {
        if ((await this.prisma.permissao_Recurso.count()) === 0) {
            await this.restaurarPadrao();
        }
    }
    async temAlgum(perfil, chaves) {
        if (chaves.includes(recursos_1.RECURSO_TRAVADO) && perfil === 'DEV')
            return true;
        const permitidos = (await this.carregar()).get(perfil);
        return chaves.some((chave) => chave !== recursos_1.RECURSO_TRAVADO && permitidos?.has(chave));
    }
    async recursosDoPerfil(perfil) {
        const recursos = [...((await this.carregar()).get(perfil) ?? [])];
        if (perfil === 'DEV')
            recursos.push(recursos_1.RECURSO_TRAVADO);
        return recursos;
    }
    async matriz() {
        const mapa = await this.carregar();
        return {
            recursos: recursos_1.RECURSOS,
            perfis: recursos_1.PERFIS,
            travado: recursos_1.RECURSO_TRAVADO,
            matriz: Object.fromEntries(recursos_1.PERFIS.map((p) => [p, [...(mapa.get(p) ?? [])]])),
        };
    }
    async definir(perfil, recursos) {
        const invalidos = recursos.filter((r) => !recursos_1.CHAVES_RECURSOS.includes(r));
        if (invalidos.length > 0) {
            throw new common_1.BadRequestException(`Recurso(s) inválido(s): ${invalidos.join(', ')}.`);
        }
        const unicos = [...new Set(recursos)].filter((r) => r !== recursos_1.RECURSO_TRAVADO);
        await this.prisma.$transaction([
            this.prisma.permissao_Recurso.deleteMany({ where: { perfil } }),
            this.prisma.permissao_Recurso.createMany({
                data: unicos.map((recurso) => ({ perfil, recurso })),
            }),
        ]);
        this.invalidar();
        return this.matriz();
    }
    async restaurarPadrao() {
        const dados = recursos_1.PERFIS.flatMap((perfil) => recursos_1.PERMISSOES_PADRAO[perfil].map((recurso) => ({ perfil, recurso })));
        await this.prisma.$transaction([
            this.prisma.permissao_Recurso.deleteMany({}),
            this.prisma.permissao_Recurso.createMany({ data: dados }),
        ]);
        this.invalidar();
        return this.matriz();
    }
    invalidar() {
        this.cache = null;
    }
    async carregar() {
        if (this.cache && Date.now() < this.cacheExpiraEm)
            return this.cache;
        const linhas = await this.prisma.permissao_Recurso.findMany();
        const mapa = new Map();
        for (const { perfil, recurso } of linhas) {
            if (!mapa.has(perfil))
                mapa.set(perfil, new Set());
            mapa.get(perfil).add(recurso);
        }
        this.cache = mapa;
        this.cacheExpiraEm = Date.now() + TTL_CACHE_MS;
        return mapa;
    }
};
exports.PermissoesService = PermissoesService;
exports.PermissoesService = PermissoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissoesService);
//# sourceMappingURL=permissoes.service.js.map