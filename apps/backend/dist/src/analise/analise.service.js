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
exports.AnaliseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const analise_constants_1 = require("./analise.constants");
const calcular_datas_reuniao_graproem_1 = require("../common/calcular-datas-reuniao-graproem");
let AnaliseService = class AnaliseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseData(valor) {
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
    async carregarProcessoAnalise(inicialId) {
        const inicial = await this.prisma.inicial.findUnique({
            where: { id: inicialId },
            include: {
                alvara_tipo: true,
                decisoes: { orderBy: { instancia: 'asc' } },
                comunique_ses: { orderBy: { criado_em: 'desc' } },
                reunioes: { orderBy: { instancia: 'asc' } },
                suspensoes_prazo: {
                    where: { final: null },
                    orderBy: { criado_em: 'desc' },
                    take: 1,
                },
            },
        });
        if (!inicial)
            throw new common_1.ForbiddenException('Processo não encontrado.');
        if (inicial.status !== 2) {
            throw new common_1.BadRequestException('O processo não está em análise técnica.');
        }
        return inicial;
    }
    prazoInstancia(tipoProcesso, instancia, alvara) {
        const prazosSmul = [
            alvara.prazo_analise_smul1,
            alvara.prazo_analise_smul2,
            alvara.prazo_analise_smul2,
        ];
        const prazosMulti = [
            alvara.prazo_analise_multi1,
            alvara.prazo_analise_multi2,
            alvara.prazo_analise_multi2,
        ];
        const lista = tipoProcesso === 2 ? prazosMulti : prazosSmul;
        return lista[Math.min(instancia - 1, 2)] ?? lista[0];
    }
    async provisionarReuniaoGraproem(inicialId, instancia) {
        const inicial = await this.prisma.inicial.findUnique({
            where: { id: inicialId },
            include: { alvara_tipo: true },
        });
        if (!inicial ||
            inicial.tipo_processo !== 2 ||
            !inicial.envio_admissibilidade) {
            return;
        }
        const { data_reuniao, data_processo } = (0, calcular_datas_reuniao_graproem_1.calcularDatasReuniaoGraproem)(inicial.envio_admissibilidade, inicial.alvara_tipo, instancia);
        await this.prisma.reuniao_Processo.upsert({
            where: {
                inicial_id_instancia: { inicial_id: inicialId, instancia },
            },
            create: {
                inicial_id: inicialId,
                instancia,
                data_reuniao,
                data_processo,
            },
            update: {
                data_reuniao,
                data_processo,
            },
        });
    }
    reuniaoCompleta(reuniao) {
        if (!reuniao)
            return false;
        return Boolean(reuniao.numero_reuniao?.trim() && reuniao.data_reuniao);
    }
    async obterContexto(inicialId) {
        const inicial = await this.prisma.inicial.findUnique({
            where: { id: inicialId },
            include: {
                alvara_tipo: true,
                distribuicao: {
                    include: {
                        tecnico_responsavel: { select: { id: true, nome: true } },
                        administrativo_responsavel: { select: { id: true, nome: true } },
                    },
                },
                decisoes: { orderBy: { instancia: 'asc' } },
                comunique_ses: { orderBy: { criado_em: 'desc' } },
                reunioes: { orderBy: { instancia: 'asc' } },
                suspensoes_prazo: {
                    where: { final: null },
                    orderBy: { criado_em: 'desc' },
                    take: 1,
                },
            },
        });
        if (!inicial)
            throw new common_1.ForbiddenException('Processo não encontrado.');
        const instancia = inicial.etapa_analise ?? 1;
        const substatus = inicial.substatus_analise ?? 0;
        const graproem = inicial.tipo_processo === 2;
        const reuniaoAtual = inicial.reunioes.find((r) => r.instancia === instancia) ?? null;
        const comuniqueAberto = inicial.comunique_ses.find((c) => !c.data_resposta && c.etapa === instancia) ??
            null;
        const preReuniaoOk = !graproem || this.reuniaoCompleta(reuniaoAtual);
        const podeDecidir = inicial.status === 2 &&
            substatus !== analise_constants_1.SubstatusAnalise.COMUNIQUE_SE &&
            substatus !== analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO &&
            (substatus !== analise_constants_1.SubstatusAnalise.PRE_REUNIAO_GRAPROEM || preReuniaoOk) &&
            preReuniaoOk;
        return {
            inicial_id: inicial.id,
            status: inicial.status,
            tipo_processo: inicial.tipo_processo,
            etapa_analise: instancia,
            substatus_analise: substatus,
            graproem,
            data_limiteSmul: inicial.data_limiteSmul,
            data_limiteMulti: inicial.data_limiteMulti,
            distribuicao: inicial.distribuicao,
            reuniao_atual: reuniaoAtual,
            pre_reuniao_completa: preReuniaoOk,
            comunique_aberto: comuniqueAberto,
            decisoes: inicial.decisoes,
            comunique_ses: inicial.comunique_ses,
            reunioes: inicial.reunioes,
            pode_registrar_pre_reuniao: graproem &&
                inicial.status === 2 &&
                substatus !== analise_constants_1.SubstatusAnalise.COMUNIQUE_SE,
            pode_decidir: podeDecidir,
            pode_comunique_se: podeDecidir,
            pode_registrar_resposta_comunique: Boolean(comuniqueAberto) &&
                substatus === analise_constants_1.SubstatusAnalise.COMUNIQUE_SE,
            pode_registrar_recurso: substatus === analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO &&
                instancia < analise_constants_1.MAX_INSTANCIA_ANALISE,
            indeferimento_definitivo: substatus === analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO &&
                instancia >= analise_constants_1.MAX_INSTANCIA_ANALISE,
            max_instancia: analise_constants_1.MAX_INSTANCIA_ANALISE,
        };
    }
    async registrarPreReuniao(inicialId, dto) {
        const inicial = await this.carregarProcessoAnalise(inicialId);
        if (inicial.tipo_processo !== 2) {
            throw new common_1.BadRequestException('Pré-reunião GRAPROEM só se aplica a processos de múltiplas interfaces.');
        }
        const instancia = inicial.etapa_analise ?? 1;
        const dataReuniao = this.parseData(dto.data_reuniao);
        const dataProcesso = this.parseData(dto.data_processo);
        const novaDataReuniao = dto.nova_data_reuniao != null &&
            String(dto.nova_data_reuniao).trim() !== ''
            ? this.parseData(dto.nova_data_reuniao)
            : null;
        const justificativa = dto.justificativa_remarcacao?.trim() || null;
        const numeroReuniao = dto.numero_reuniao?.trim();
        const parecerGrupo = dto.parecer_grupo?.trim() || null;
        if (!numeroReuniao) {
            throw new common_1.BadRequestException('Informe o número da reunião.');
        }
        if (novaDataReuniao && !justificativa) {
            throw new common_1.BadRequestException('Informe a justificativa ao remarcar a data da reunião.');
        }
        const reuniao = await this.prisma.reuniao_Processo.upsert({
            where: {
                inicial_id_instancia: { inicial_id: inicialId, instancia },
            },
            create: {
                inicial_id: inicialId,
                instancia,
                data_reuniao: dataReuniao,
                data_processo: dataProcesso,
                numero_reuniao: numeroReuniao,
                parecer_grupo: parecerGrupo,
                nova_data_reuniao: novaDataReuniao,
                justificativa_remarcacao: justificativa,
            },
            update: {
                data_reuniao: dataReuniao,
                data_processo: dataProcesso,
                numero_reuniao: numeroReuniao,
                parecer_grupo: parecerGrupo,
                nova_data_reuniao: novaDataReuniao,
                justificativa_remarcacao: justificativa,
            },
        });
        if ((inicial.substatus_analise ?? 0) ===
            analise_constants_1.SubstatusAnalise.PRE_REUNIAO_GRAPROEM) {
            await this.prisma.inicial.update({
                where: { id: inicialId },
                data: { substatus_analise: analise_constants_1.SubstatusAnalise.NORMAL },
            });
        }
        return reuniao;
    }
    async registrarComuniqueSe(inicialId, dto) {
        const inicial = await this.carregarProcessoAnalise(inicialId);
        const instancia = inicial.etapa_analise ?? 1;
        const graproem = inicial.tipo_processo === 2 ? 1 : 0;
        if ((inicial.substatus_analise ?? 0) === analise_constants_1.SubstatusAnalise.COMUNIQUE_SE) {
            throw new common_1.BadRequestException('Já existe comunique-se em aberto.');
        }
        if (inicial.tipo_processo === 2) {
            const reuniao = inicial.reunioes.find((r) => r.instancia === instancia) ?? null;
            if (!this.reuniaoCompleta(reuniao)) {
                throw new common_1.BadRequestException('Preencha os dados da pré-reunião GRAPROEM antes do comunique-se.');
            }
        }
        const data = this.parseData(dto.data);
        const comunique = await this.prisma.comunique_se.create({
            data: {
                inicial_id: inicialId,
                data,
                complementar: dto.complementar ?? false,
                etapa: instancia,
                graproem,
            },
        });
        await this.prisma.suspensao_Prazo.create({
            data: {
                inicial_id: inicialId,
                inicio: data,
                motivo: analise_constants_1.MotivoSuspensao.COMUNIQUE_SE,
                etapa: instancia,
            },
        });
        await this.prisma.inicial.update({
            where: { id: inicialId },
            data: { substatus_analise: analise_constants_1.SubstatusAnalise.COMUNIQUE_SE },
        });
        const decisaoId = await this.idDecisaoInstancia(inicialId, instancia);
        await this.prisma.decisao.update({
            where: { id: decisaoId },
            data: {
                parecer: analise_constants_1.ParecerDecisao.COMUNIQUE_SE,
                publicacao_parecer: data,
                graproem,
            },
        });
        return comunique;
    }
    async idDecisaoInstancia(inicialId, instancia) {
        const existente = await this.prisma.decisao.findFirst({
            where: { inicial_id: inicialId, instancia },
        });
        if (existente)
            return existente.id;
        const criada = await this.prisma.decisao.create({
            data: {
                inicial_id: inicialId,
                instancia,
                etapa: 2,
                graproem: 0,
                parecer: analise_constants_1.ParecerDecisao.PENDENTE,
            },
        });
        return criada.id;
    }
    async registrarRespostaComuniqueSe(comuniqueId, dataResposta) {
        const comunique = await this.prisma.comunique_se.findUnique({
            where: { id: comuniqueId },
            include: { inicial: true },
        });
        if (!comunique)
            throw new common_1.ForbiddenException('Comunique-se não encontrado.');
        if (comunique.data_resposta) {
            throw new common_1.BadRequestException('Comunique-se já possui resposta registrada.');
        }
        const resposta = this.parseData(dataResposta);
        const atualizado = await this.prisma.comunique_se.update({
            where: { id: comuniqueId },
            data: { data_resposta: resposta },
        });
        const suspensao = await this.prisma.suspensao_Prazo.findFirst({
            where: {
                inicial_id: comunique.inicial_id,
                etapa: comunique.etapa,
                final: null,
            },
            orderBy: { criado_em: 'desc' },
        });
        if (suspensao) {
            await this.prisma.suspensao_Prazo.update({
                where: { id: suspensao.id },
                data: { final: resposta },
            });
        }
        const graproem = comunique.inicial.tipo_processo === 2;
        await this.prisma.inicial.update({
            where: { id: comunique.inicial_id },
            data: {
                substatus_analise: graproem
                    ? analise_constants_1.SubstatusAnalise.PRE_REUNIAO_GRAPROEM
                    : analise_constants_1.SubstatusAnalise.NORMAL,
            },
        });
        return atualizado;
    }
    async registrarDecisao(inicialId, dto) {
        const inicial = await this.carregarProcessoAnalise(inicialId);
        const instancia = inicial.etapa_analise ?? 1;
        const graproem = inicial.tipo_processo === 2 ? 1 : 0;
        if (dto.parecer === analise_constants_1.ParecerDecisao.COMUNIQUE_SE) {
            return this.registrarComuniqueSe(inicialId, {
                data: new Date(),
                complementar: false,
            });
        }
        if ((inicial.substatus_analise ?? 0) === analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO) {
            throw new common_1.BadRequestException('Registre o recurso do munícipe antes de nova decisão.');
        }
        if (inicial.tipo_processo === 2) {
            const reuniao = inicial.reunioes.find((r) => r.instancia === instancia) ?? null;
            if (!this.reuniaoCompleta(reuniao)) {
                throw new common_1.BadRequestException('Preencha data e número da pré-reunião GRAPROEM.');
            }
        }
        const decisaoId = await this.idDecisaoInstancia(inicialId, instancia);
        await this.prisma.decisao.update({
            where: { id: decisaoId },
            data: {
                parecer: dto.parecer,
                obs: dto.obs,
                parecer_tecnico: dto.parecer_tecnico,
                publicacao_parecer: new Date(),
                graproem,
            },
        });
        if (dto.parecer === analise_constants_1.ParecerDecisao.DEFERIDO) {
            await this.prisma.inicial.update({
                where: { id: inicialId },
                data: {
                    status: 3,
                    substatus_analise: analise_constants_1.SubstatusAnalise.NORMAL,
                },
            });
            return {
                resultado: 'DEFERIDO',
                mensagem: 'Processo deferido na instância. Prossiga para a fase de finalização.',
                proxima_acao: 'FINALIZACAO',
            };
        }
        if (dto.parecer === analise_constants_1.ParecerDecisao.INDEFERIDO) {
            if (instancia >= analise_constants_1.MAX_INSTANCIA_ANALISE) {
                await this.prisma.inicial.update({
                    where: { id: inicialId },
                    data: {
                        status: 4,
                        substatus_analise: analise_constants_1.SubstatusAnalise.NORMAL,
                    },
                });
                return {
                    resultado: 'INDEFERIDO_DEFINITIVO',
                    mensagem: 'Indeferimento na 3ª instância. Processo encerrado.',
                };
            }
            await this.prisma.inicial.update({
                where: { id: inicialId },
                data: { substatus_analise: analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO },
            });
            return {
                resultado: 'INDEFERIDO',
                mensagem: 'Processo indeferido nesta instância. Aguardando recurso do munícipe.',
                proxima_acao: 'RECURSO',
                instancia,
            };
        }
        throw new common_1.BadRequestException('Parecer inválido.');
    }
    async registrarRecurso(inicialId) {
        const inicial = await this.carregarProcessoAnalise(inicialId);
        const instanciaAtual = inicial.etapa_analise ?? 1;
        if ((inicial.substatus_analise ?? 0) !==
            analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO) {
            throw new common_1.BadRequestException('O processo não está aguardando recurso.');
        }
        if (instanciaAtual >= analise_constants_1.MAX_INSTANCIA_ANALISE) {
            throw new common_1.BadRequestException('Não há mais instâncias disponíveis para recurso.');
        }
        const novaInstancia = instanciaAtual + 1;
        const graproem = inicial.tipo_processo === 2 ? 1 : 0;
        const substatus = graproem === 1
            ? analise_constants_1.SubstatusAnalise.PRE_REUNIAO_GRAPROEM
            : analise_constants_1.SubstatusAnalise.NORMAL;
        await this.prisma.inicial.update({
            where: { id: inicialId },
            data: {
                etapa_analise: novaInstancia,
                substatus_analise: substatus,
            },
        });
        await this.prisma.decisao.create({
            data: {
                inicial_id: inicialId,
                instancia: novaInstancia,
                etapa: 2,
                graproem,
                parecer: analise_constants_1.ParecerDecisao.PENDENTE,
            },
        });
        if (graproem === 1 && inicial.envio_admissibilidade) {
            const alvara = inicial.alvara_tipo;
            const base = new Date(inicial.envio_admissibilidade);
            const duracao = this.prazoInstancia(2, novaInstancia, alvara);
            const finalPlanejado = new Date(base);
            finalPlanejado.setDate(finalPlanejado.getDate() + duracao);
            await this.prisma.controle_Prazo.create({
                data: {
                    inicial_id: inicialId,
                    data_inicio: new Date(),
                    final_planejado: finalPlanejado,
                    duracao_planejada: duracao,
                    etapa: 2,
                    graproem: 1,
                    status: 0,
                },
            });
            await this.provisionarReuniaoGraproem(inicialId, novaInstancia);
        }
        return {
            etapa_analise: novaInstancia,
            substatus_analise: substatus,
            mensagem: graproem
                ? 'Recurso registrado. Atualize os dados da pré-reunião GRAPROEM.'
                : 'Recurso registrado. O processo retornou à análise técnica.',
        };
    }
    async encerrarSemRecurso(inicialId) {
        const inicial = await this.carregarProcessoAnalise(inicialId);
        if ((inicial.substatus_analise ?? 0) !==
            analise_constants_1.SubstatusAnalise.AGUARDANDO_RECURSO) {
            throw new common_1.BadRequestException('O processo não está aguardando recurso.');
        }
        await this.prisma.inicial.update({
            where: { id: inicialId },
            data: { status: 4, substatus_analise: analise_constants_1.SubstatusAnalise.NORMAL },
        });
        return {
            mensagem: 'Prazo de recurso encerrado sem manifestação. Processo indeferido.',
        };
    }
};
exports.AnaliseService = AnaliseService;
exports.AnaliseService = AnaliseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnaliseService);
//# sourceMappingURL=analise.service.js.map