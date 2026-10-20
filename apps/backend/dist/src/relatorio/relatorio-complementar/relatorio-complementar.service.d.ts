import { PrismaService } from 'src/prisma/prisma.service';
export declare class RelatorioComplementarService {
    private prisma;
    constructor(prisma: PrismaService);
    getPrazoAnaliseAdmissibilidadeAR(dataInicial: string, dataFinal: string): Promise<{
        cabecalho: {
            prazoFixoAnalise: string;
            dataInicio: string;
            dataFim: string;
            qtdAnaliseFinalizada: string;
            qtdAnaliseNoPrazo: string;
            qtdAnaliseExcedido: string;
            mediaPeriodoAnalise: string;
            mediaPeriodoReconsideracao: string;
        };
        dados: Record<string, Partial<Record<"jan." | "fev." | "mar." | "abr." | "mai." | "jun." | "jul." | "ago." | "set." | "out." | "nov." | "dez.", any[]>>>;
    }>;
    getPrazoAnaliseAdmissibilidadeRR(dataInicial: string, dataFinal: string): Promise<{
        cabecalho: {
            prazoFixoAnalise: string;
            dataInicio: string;
            dataFim: string;
            qtdAnaliseFinalizada: string;
            qtdAnaliseNoPrazo: string;
            qtdAnaliseExcedido: string;
            mediaPeriodoAnalise: string;
            mediaPeriodoReconsideracao: string;
        };
        dados: {
            reconsiderado: boolean;
            ano: number;
            mes: "jan." | "fev." | "mar." | "abr." | "mai." | "jun." | "jul." | "ago." | "set." | "out." | "nov." | "dez.";
            envio_admissibilidade: Date;
            suspensao_prazo: number;
            suspensao_prazo_etapa_1: number;
            suspensao_prazo_etapa_2: number;
            tempo_de_analise_admissibilidade: number;
            tempo_de_analise_reconsideracao: number;
            motivos_suspensao: string[];
            suspensoes_prazo: {
                id: string;
                criado_em: Date;
                alterado_em: Date;
                inicial_id: number;
                motivo: number;
                inicio: Date;
                final: Date | null;
                etapa: number;
            }[];
            id: number;
            status: number | null;
            criado_em: Date;
            alterado_em: Date;
            decreto: boolean;
            sei: string;
            tipo_requerimento: number;
            requerimento: string;
            aprova_digital: string | null;
            processo_fisico: string | null;
            data_protocolo: Date;
            alvara_tipo_id: string;
            tipo_processo: number | null;
            etapa_analise: number | null;
            substatus_analise: number | null;
            obs: string | null;
            pagamento: number | null;
            requalifica_rapido: boolean | null;
            associado_reforma: boolean | null;
            numero_requerimento: string | null;
            ar_ou_rr: string | null;
            numero_guia_tev: string | null;
            guia_vinculada_outro: boolean | null;
            data_limiteSmul: Date | null;
            data_limiteMulti: Date | null;
        }[];
    }>;
    getGabinetePrefeito(): Promise<Record<string, any>[]>;
    private buscarAdmissibilidadesPrazo;
    private mapearLinhaPrazo;
    private montarCabecalhoPrazo;
    private agruparPorAnoMes;
    private criarGrupoGabineteAno;
    private normalizarPeriodo;
    private parseData;
    private diferencaEmDias;
    private somarSuspensoes;
    private mediaDias;
    private formatarData;
}
