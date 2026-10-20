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
exports.RelatorioComplementarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const MESES = [
    'jan.',
    'fev.',
    'mar.',
    'abr.',
    'mai.',
    'jun.',
    'jul.',
    'ago.',
    'set.',
    'out.',
    'nov.',
    'dez.',
];
let RelatorioComplementarService = class RelatorioComplementarService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPrazoAnaliseAdmissibilidadeAR(dataInicial, dataFinal) {
        const periodo = this.normalizarPeriodo(dataInicial, dataFinal);
        const dados = await this.buscarAdmissibilidadesPrazo(periodo, false);
        const linhas = dados.map((item) => this.mapearLinhaPrazo(item));
        return {
            cabecalho: this.montarCabecalhoPrazo(linhas, periodo),
            dados: this.agruparPorAnoMes(linhas),
        };
    }
    async getPrazoAnaliseAdmissibilidadeRR(dataInicial, dataFinal) {
        const periodo = this.normalizarPeriodo(dataInicial, dataFinal);
        const dados = await this.buscarAdmissibilidadesPrazo(periodo, true);
        const linhas = dados.map((item) => this.mapearLinhaPrazo(item));
        return {
            cabecalho: this.montarCabecalhoPrazo(linhas, periodo),
            dados: linhas,
        };
    }
    async getGabinetePrefeito() {
        const processos = await this.prisma.inicial.findMany({
            where: {
                requalifica_rapido: false,
            },
            include: {
                admissibilidade: true,
                conclusao: true,
            },
            orderBy: {
                data_protocolo: 'asc',
            },
        });
        const porAno = new Map();
        for (const processo of processos) {
            const ano = processo.data_protocolo.getFullYear();
            const mes = MESES[processo.data_protocolo.getMonth()];
            if (!porAno.has(ano)) {
                porAno.set(ano, this.criarGrupoGabineteAno(ano));
            }
            const grupoAno = porAno.get(ano);
            const linha = {
                ...processo,
                numero_do_processo: processo.processo_fisico ?? processo.sei ?? processo.aprova_digital ?? '',
                tempo_de_analise_pedido_inicial: this.diferencaEmDias(processo.envio_admissibilidade ?? processo.data_protocolo, processo.admissibilidade?.data_decisao_interlocutoria ?? processo.conclusao?.data_conclusao ?? null),
                tempo_de_analise_recurso: processo.admissibilidade?.reconsiderado
                    ? this.diferencaEmDias(processo.admissibilidade?.data_decisao_interlocutoria ?? null, processo.conclusao?.data_conclusao ?? null)
                    : null,
            };
            grupoAno.dados.push(linha);
            grupoAno[mes].push(linha);
            grupoAno.numeros_de_processos.push(linha);
            grupoAno.processos_protocolados += 1;
            if (processo.status === 3)
                grupoAno.processos_aprovados += 1;
        }
        return Array.from(porAno.values());
    }
    async buscarAdmissibilidadesPrazo(periodo, requalificaRapido) {
        return await this.prisma.admissibilidade.findMany({
            where: {
                data_decisao_interlocutoria: periodo,
                inicial: {
                    requalifica_rapido: requalificaRapido,
                },
            },
            include: {
                inicial: {
                    include: {
                        suspensoes_prazo: true,
                    },
                },
            },
            orderBy: {
                data_decisao_interlocutoria: 'asc',
            },
        });
    }
    mapearLinhaPrazo(admissibilidade) {
        const inicial = admissibilidade.inicial;
        const dataReferencia = admissibilidade.data_decisao_interlocutoria ??
            admissibilidade.data_envio ??
            inicial.envio_admissibilidade ??
            inicial.data_protocolo;
        const suspensoesEtapa1 = inicial.suspensoes_prazo.filter((item) => item.etapa === 1);
        const suspensoesEtapa2 = inicial.suspensoes_prazo.filter((item) => item.etapa === 2);
        return {
            ...inicial,
            reconsiderado: admissibilidade.reconsiderado,
            ano: dataReferencia.getFullYear(),
            mes: MESES[dataReferencia.getMonth()],
            envio_admissibilidade: admissibilidade.data_envio ?? inicial.envio_admissibilidade ?? null,
            suspensao_prazo: this.somarSuspensoes(inicial.suspensoes_prazo),
            suspensao_prazo_etapa_1: this.somarSuspensoes(suspensoesEtapa1),
            suspensao_prazo_etapa_2: this.somarSuspensoes(suspensoesEtapa2),
            tempo_de_analise_admissibilidade: this.diferencaEmDias(inicial.envio_admissibilidade ?? inicial.data_protocolo, admissibilidade.data_decisao_interlocutoria),
            tempo_de_analise_reconsideracao: admissibilidade.reconsiderado
                ? this.diferencaEmDias(admissibilidade.data_decisao_interlocutoria, admissibilidade.alterado_em)
                : null,
            motivos_suspensao: inicial.suspensoes_prazo.map((item) => String(item.motivo)),
        };
    }
    montarCabecalhoPrazo(linhas, periodo) {
        const prazoFixo = 15;
        const temposAnalise = linhas
            .map((linha) => linha.tempo_de_analise_admissibilidade)
            .filter((valor) => typeof valor === 'number');
        const temposReconsideracao = linhas
            .map((linha) => linha.tempo_de_analise_reconsideracao)
            .filter((valor) => typeof valor === 'number');
        return {
            prazoFixoAnalise: `${prazoFixo} dias`,
            dataInicio: this.formatarData(periodo.gte),
            dataFim: this.formatarData(periodo.lte),
            qtdAnaliseFinalizada: String(linhas.length),
            qtdAnaliseNoPrazo: String(linhas.filter((linha) => (linha.tempo_de_analise_admissibilidade ?? 0) <= prazoFixo).length),
            qtdAnaliseExcedido: String(linhas.filter((linha) => (linha.tempo_de_analise_admissibilidade ?? 0) > prazoFixo).length),
            mediaPeriodoAnalise: this.mediaDias(temposAnalise),
            mediaPeriodoReconsideracao: this.mediaDias(temposReconsideracao),
        };
    }
    agruparPorAnoMes(linhas) {
        const agrupado = {};
        for (const linha of linhas) {
            const ano = String(linha.ano);
            const mes = linha.mes;
            agrupado[ano] ??= {};
            agrupado[ano][mes] ??= [];
            agrupado[ano][mes].push(linha);
        }
        return agrupado;
    }
    criarGrupoGabineteAno(ano) {
        return {
            ano,
            dados: [],
            'jan.': [],
            'fev.': [],
            'mar.': [],
            'abr.': [],
            'mai.': [],
            'jun.': [],
            'jul.': [],
            'ago.': [],
            'set.': [],
            'out.': [],
            'nov.': [],
            'dez.': [],
            numeros_de_processos: [],
            processos_protocolados: 0,
            processos_aprovados: 0,
        };
    }
    normalizarPeriodo(dataInicial, dataFinal) {
        const gte = this.parseData(dataInicial, false);
        const lte = this.parseData(dataFinal, true);
        if (gte > lte) {
            throw new common_1.BadRequestException('Data inicial não pode ser maior que a data final.');
        }
        return { gte, lte };
    }
    parseData(valor, finalDoDia) {
        const partes = valor.split('-').map(Number);
        if (partes.length !== 3 || partes.some((parte) => Number.isNaN(parte))) {
            throw new common_1.BadRequestException('Data inválida.');
        }
        const [dia, mes, ano] = partes;
        return new Date(ano, mes - 1, dia, finalDoDia ? 23 : 0, finalDoDia ? 59 : 0, finalDoDia ? 59 : 0, finalDoDia ? 999 : 0);
    }
    diferencaEmDias(inicio, fim) {
        if (!inicio || !fim)
            return null;
        const umDia = 1000 * 60 * 60 * 24;
        return Math.max(0, Math.ceil((fim.getTime() - inicio.getTime()) / umDia));
    }
    somarSuspensoes(suspensoes) {
        const total = suspensoes.reduce((acc, suspensao) => {
            return acc + (this.diferencaEmDias(suspensao.inicio, suspensao.final) ?? 0);
        }, 0);
        return total || null;
    }
    mediaDias(valores) {
        if (valores.length === 0)
            return '0 dias';
        const media = valores.reduce((acc, valor) => acc + valor, 0) / valores.length;
        return `${media.toFixed(1)} dias`;
    }
    formatarData(data) {
        return data.toLocaleDateString('pt-BR');
    }
};
exports.RelatorioComplementarService = RelatorioComplementarService;
exports.RelatorioComplementarService = RelatorioComplementarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatorioComplementarService);
//# sourceMappingURL=relatorio-complementar.service.js.map