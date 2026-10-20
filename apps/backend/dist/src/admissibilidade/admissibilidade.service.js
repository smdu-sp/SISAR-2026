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
exports.AdmissibilidadeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
const schedule_1 = require("@nestjs/schedule");
let AdmissibilidadeService = class AdmissibilidadeService {
    constructor(prisma, app) {
        this.prisma = prisma;
        this.app = app;
    }
    async create(createAdmissibilidadeDto) {
        const { interfaces, tipo_processo, inicial_id } = createAdmissibilidadeDto;
        const admissibilidade = await this.prisma.admissibilidade.create({
            data: this.toAdmissibilidadeData(createAdmissibilidadeDto),
            include: { inicial: true }
        });
        if (tipo_processo) {
            await this.prisma.inicial.update({
                where: { id: inicial_id },
                data: { tipo_processo }
            });
        }
        ;
        if (tipo_processo === 2 && interfaces) {
            await this.prisma.interface.upsert({
                where: { inicial_id },
                create: {
                    inicial_id,
                    ...interfaces
                },
                update: {
                    ...interfaces
                }
            });
        }
        if (!admissibilidade)
            throw new common_1.InternalServerErrorException('Não foi possível criar a subprefeitura. Tente novamente.');
        return this.enriquecerDataEnvio(admissibilidade);
    }
    async listaCompleta() {
        const admissibilidade = await this.prisma.admissibilidade.findMany();
        if (!admissibilidade || admissibilidade.length == 0)
            throw new common_1.InternalServerErrorException('Nenhuma subprefeitura encontrada');
        return admissibilidade;
    }
    async contarForaDoPrazo() {
        const registros = await this.prisma.inicial.findMany({
            where: {
                admissibilidade: {
                    data_decisao_interlocutoria: {
                        not: null,
                    },
                },
            },
            include: {
                admissibilidade: {
                    select: {
                        data_decisao_interlocutoria: true,
                        unidade_id: true,
                    },
                },
                alvara_tipo: {
                    select: {
                        prazo_admissibilidade_smul: true,
                    },
                },
            },
        });
        const count = registros.filter((registro) => {
            const dataDecisao = registro.admissibilidade?.data_decisao_interlocutoria;
            const envioAdmissibilidade = registro.envio_admissibilidade;
            if (dataDecisao && envioAdmissibilidade) {
                const diffTime = new Date(dataDecisao).getTime() - new Date(envioAdmissibilidade).getTime();
                const diffDays = diffTime / (1000 * 3600 * 24);
                return diffDays > registro.alvara_tipo.prazo_admissibilidade_smul;
            }
            return false;
        }).length;
        return count;
    }
    async contarDentroDoPrazo() {
        const registros = await this.prisma.inicial.findMany({
            where: {
                admissibilidade: {
                    data_decisao_interlocutoria: {
                        not: null,
                    },
                },
            },
            include: {
                admissibilidade: {
                    select: {
                        data_decisao_interlocutoria: true,
                        unidade_id: true,
                    },
                },
                alvara_tipo: {
                    select: {
                        prazo_admissibilidade_smul: true,
                    },
                },
            },
        });
        const count = registros.filter((registro) => {
            const dataDecisao = registro.admissibilidade?.data_decisao_interlocutoria;
            const envioAdmissibilidade = registro.envio_admissibilidade;
            if (dataDecisao && envioAdmissibilidade) {
                const diffTime = new Date(dataDecisao).getTime() - new Date(envioAdmissibilidade).getTime();
                const diffDays = diffTime / (1000 * 3600 * 24);
                return diffDays <= registro.alvara_tipo.prazo_admissibilidade_smul;
            }
            return false;
        }).length;
        return count;
    }
    async admissibilidadeFinalizada() {
        const count = await this.prisma.admissibilidade.count({
            where: {
                data_decisao_interlocutoria: {
                    not: null,
                },
            },
        });
        return count;
    }
    async buscarTudo(pagina, limite, filtro, busca) {
        [pagina, limite] = this.app.verificaPagina(pagina, limite);
        const searchParams = {
            ...(busca ?
                {
                    OR: [
                        { sei: { contains: busca } },
                    ]
                } :
                {}),
        };
        const total = await this.prisma.admissibilidade.count({
            where: {
                inicial: { ...searchParams }
            }
        });
        if (total == 0)
            return { total: 0, pagina: 0, limite: 0, data: [] };
        [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
        const admissibilidades = await this.prisma.admissibilidade.findMany({
            include: {
                inicial: true
            },
            where: {
                status: filtro !== -1 ? filtro : undefined,
                inicial: { ...searchParams }
            },
            skip: (pagina - 1) * limite,
            take: limite,
        });
        if (admissibilidades.length === 0)
            throw new common_1.ForbiddenException('Nenhum processo encontrado');
        return {
            data: admissibilidades.map((adm) => this.enriquecerDataEnvio(adm)),
            total,
            pagina,
            limite
        };
    }
    async findAll() {
        const admissibilidade = await this.prisma.admissibilidade.findMany();
        if (!admissibilidade || admissibilidade.length == 0)
            throw new common_1.InternalServerErrorException('Nenhuma subprefeitura encontrada');
        return admissibilidade;
    }
    async buscarPorId(id) {
        const admissibilidade = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: id },
            include: { inicial: true }
        });
        if (!admissibilidade)
            throw new common_1.InternalServerErrorException('Nenhuma admissibilidade encontrada');
        return this.enriquecerDataEnvio(admissibilidade);
    }
    async ultimaAtualizacao(id) {
        const inicial = await this.prisma.inicial.update({
            where: { id },
            data: { alterado_em: new Date() }
        });
        if (!inicial)
            throw new common_1.InternalServerErrorException('Nenhum processo encontrado');
        return inicial;
    }
    async atualizarStatus(id, updateAdmissibilidadeDto) {
        const { interfaces, tipo_processo, inicial_id } = updateAdmissibilidadeDto;
        const admissibilidade = await this.prisma.admissibilidade.update({
            where: { inicial_id: id },
            data: this.toAdmissibilidadeData(updateAdmissibilidadeDto, { omitInicialId: true })
        });
        if (tipo_processo) {
            await this.prisma.inicial.update({
                where: { id: inicial_id },
                data: { tipo_processo }
            });
            this.ultimaAtualizacao(id);
        }
        ;
        if (tipo_processo === 2 && interfaces) {
            this.ultimaAtualizacao(id);
            await this.prisma.interface.upsert({
                where: { inicial_id },
                create: {
                    inicial_id,
                    ...interfaces
                },
                update: { ...interfaces }
            });
        }
        if (!admissibilidade)
            throw new common_1.InternalServerErrorException('Nenhuma admissibilidade encontrada');
        this.ultimaAtualizacao(id);
        const admissibilidadeAtualizada = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: id },
            include: { inicial: true },
        });
        return this.enriquecerDataEnvio(admissibilidadeAtualizada ?? admissibilidade);
    }
    async admitir(inicialId, dto) {
        const { interfaces, tipo_processo } = dto;
        await this.prisma.$transaction(async (tx) => {
            await tx.admissibilidade.update({
                where: { inicial_id: inicialId },
                data: {
                    status: 0,
                    unidade_id: dto.unidade_id,
                    subprefeitura_id: dto.subprefeitura_id,
                    data_decisao_interlocutoria: this.parseDataCampo(dto.data_decisao_interlocutoria),
                },
            });
            if (tipo_processo === 2 && interfaces) {
                await tx.interface.upsert({
                    where: { inicial_id: inicialId },
                    create: { inicial_id: inicialId, ...interfaces },
                    update: { ...interfaces },
                });
            }
            await tx.inicial.update({
                where: { id: inicialId },
                data: {
                    tipo_processo,
                    status: 2,
                    etapa_analise: 1,
                    substatus_analise: tipo_processo === 2 ? 3 : 0,
                    alterado_em: new Date(),
                },
            });
        });
        const admissibilidade = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: inicialId },
            include: { inicial: true },
        });
        if (!admissibilidade)
            throw new common_1.InternalServerErrorException('Nenhuma admissibilidade encontrada');
        return this.enriquecerDataEnvio(admissibilidade);
    }
    async inadmitir(inicialId, dto) {
        await this.prisma.$transaction(async (tx) => {
            await tx.admissibilidade.update({
                where: { inicial_id: inicialId },
                data: {
                    status: 3,
                    data_decisao_interlocutoria: new Date(),
                    parecer_admissibilidade_id: dto.parecer_admissibilidade_id,
                    obs: dto.obs,
                },
            });
            await tx.inicial.update({
                where: { id: inicialId },
                data: { alterado_em: new Date() },
            });
        });
        const admissibilidade = await this.prisma.admissibilidade.findUnique({
            where: { inicial_id: inicialId },
            include: { inicial: true },
        });
        if (!admissibilidade)
            throw new common_1.InternalServerErrorException('Nenhuma admissibilidade encontrada');
        return this.enriquecerDataEnvio(admissibilidade);
    }
    remove(id) {
        return `This action removes a #${id} admissibilidade`;
    }
    async verificaDiasUteis(data, dias) {
        const feriado = await fetch(`${process.env.API_FERIADOS_URL}/feriados/diasUteisCorridos/${data}/${dias}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json());
        return feriado;
    }
    dataExperacaoNaoUtil(data, dias) {
        const dataExperacao = new Date(data);
        dataExperacao.setDate(dataExperacao.getDate() + dias);
        return dataExperacao;
    }
    async verificaReconsideracao() {
        const reconsiderados = await this.prisma.admissibilidade.findMany({
            where: {
                AND: [
                    { status: 3 },
                    { data_decisao_interlocutoria: { not: null } }
                ]
            },
            select: {
                inicial_id: true,
                data_decisao_interlocutoria: true,
                inicial: {
                    select: {
                        alvara_tipo: {
                            select: {
                                reconsideracao_multi: true,
                                reconsideracao_smul: true,
                                reconsideracao_multi_tipo: true,
                                reconsideracao_smul_tipo: true
                            }
                        },
                        tipo_processo: true
                    }
                }
            }
        });
        if (!reconsiderados)
            throw new common_1.InternalServerErrorException('Nenhum processo encontrado');
        for (let i = 0; i < reconsiderados.length; i++) {
            let dataFinal;
            if (reconsiderados[i].inicial.tipo_processo === 1
                && reconsiderados[i].inicial.alvara_tipo.reconsideracao_smul_tipo === 0) {
                const diasUteisSmul = await this.verificaDiasUteis(reconsiderados[i].data_decisao_interlocutoria.toString(), reconsiderados[i].inicial.alvara_tipo.reconsideracao_smul);
                dataFinal = new Date(diasUteisSmul.dataExpiracao.valueOf());
            }
            else {
                dataFinal = this.dataExperacaoNaoUtil(reconsiderados[i].data_decisao_interlocutoria.toString(), reconsiderados[i].inicial.alvara_tipo.reconsideracao_smul);
            }
            if (new Date() >= dataFinal) {
                await this.prisma.admissibilidade.update({
                    where: { inicial_id: reconsiderados[i].inicial_id },
                    data: { status: 2 }
                });
                await this.prisma.inicial.update({
                    where: { id: reconsiderados[i].inicial_id },
                    data: { status: 1 }
                });
            }
        }
        return reconsiderados;
    }
    async medianaTempoAdmissibilidade() {
        const registros = await this.prisma.inicial.findMany({
            where: {
                admissibilidade: {
                    data_decisao_interlocutoria: {
                        not: null,
                    },
                },
                envio_admissibilidade: {
                    not: null,
                },
            },
            include: {
                admissibilidade: {
                    select: {
                        data_decisao_interlocutoria: true,
                    },
                },
            },
        });
        const diffsInDays = registros
            .map((registro) => {
            const dataDecisao = registro.admissibilidade?.data_decisao_interlocutoria;
            const envioAdmissibilidade = registro.envio_admissibilidade;
            if (dataDecisao && envioAdmissibilidade) {
                const diffTime = new Date(dataDecisao).getTime() - new Date(envioAdmissibilidade).getTime();
                return diffTime / (1000 * 3600 * 24);
            }
            return null;
        }).filter((diff) => diff !== null);
        if (diffsInDays.length === 0)
            return null;
        diffsInDays.sort((a, b) => a - b);
        const middle = Math.floor(diffsInDays.length / 2);
        if (diffsInDays.length % 2 === 0)
            return (diffsInDays[middle - 1] + diffsInDays[middle]) / 2;
        return diffsInDays[middle];
    }
    async registrosAdmissibilidadeFinalizada() {
        const registros = await this.prisma.admissibilidade.findMany({
            where: {
                data_decisao_interlocutoria: {
                    not: null,
                },
            },
            include: {
                inicial: {
                    select: {
                        sei: true,
                        envio_admissibilidade: true,
                    },
                },
            },
        });
        const resultado = registros.map((registro) => {
            const dataDecisaoInterlocutoria = new Date(registro.data_decisao_interlocutoria);
            const envioAdmissibilidade = new Date(registro.inicial.envio_admissibilidade);
            const diffTime = dataDecisaoInterlocutoria.getTime() - envioAdmissibilidade.getTime();
            const dias = Math.floor(diffTime / (1000 * 3600 * 24));
            const status = dias > 15 ? "Fora do Prazo" : "Dentro do Prazo";
            return {
                dataDecisaoInterlocutoria,
                sei: registro.inicial.sei,
                envioAdmissibilidade,
                dias,
                status,
            };
        });
        return resultado;
    }
    enriquecerDataEnvio(adm) {
        const dataEnvio = adm.data_envio ?? adm.inicial?.envio_admissibilidade ?? null;
        return {
            ...adm,
            data_envio: dataEnvio,
            ...(adm.inicial
                ? {
                    inicial: {
                        ...adm.inicial,
                        envio_admissibilidade: adm.inicial.envio_admissibilidade ?? dataEnvio,
                    },
                }
                : {}),
        };
    }
    parseDataCampo(valor) {
        if (valor == null || valor === '')
            return undefined;
        if (valor instanceof Date)
            return valor;
        const texto = String(valor).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto))
            return new Date(`${texto}T12:00:00.000Z`);
        const data = new Date(texto);
        if (Number.isNaN(data.getTime()))
            throw new common_1.ForbiddenException('Data inválida.');
        return data;
    }
    toAdmissibilidadeData(dto, options) {
        const { interfaces: _interfaces, tipo_processo: _tipoProcesso, inicial_id, data_envio, data_decisao_interlocutoria, unidade_id, subprefeitura_id, categoria_id, parecer_admissibilidade_id, status, } = dto;
        return {
            ...(options?.omitInicialId ? {} : inicial_id !== undefined ? { inicial_id } : {}),
            ...(unidade_id !== undefined ? { unidade_id } : {}),
            ...(subprefeitura_id !== undefined ? { subprefeitura_id } : {}),
            ...(categoria_id !== undefined ? { categoria_id } : {}),
            ...(parecer_admissibilidade_id !== undefined ? { parecer_admissibilidade_id } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(data_envio !== undefined ? { data_envio: this.parseDataCampo(data_envio) } : {}),
            ...(data_decisao_interlocutoria !== undefined
                ? { data_decisao_interlocutoria: this.parseDataCampo(data_decisao_interlocutoria) }
                : {}),
        };
    }
};
exports.AdmissibilidadeService = AdmissibilidadeService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_6AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmissibilidadeService.prototype, "verificaReconsideracao", null);
exports.AdmissibilidadeService = AdmissibilidadeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, app_service_1.AppService])
], AdmissibilidadeService);
//# sourceMappingURL=admissibilidade.service.js.map