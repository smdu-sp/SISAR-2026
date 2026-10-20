import { Admissibilidade, Inicial, Unidade } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeriodFilterDto } from './dto/response-relatorio.dto';
export declare class RelatorioService {
    private prisma;
    constructor(prisma: PrismaService);
    getUnidades(): Promise<Partial<Unidade>[]>;
    countByUnidade(status: number, periodFilter: PeriodFilterDto, unidadeId: string | null, tipo_processo?: number): Promise<Record<string, number>>;
    getIdByUnidade(sigla: string): Promise<string | null>;
    countTotal(status: number, decisaoNull: boolean, periodFilter: PeriodFilterDto): Promise<number>;
    getData(status: number, decisaoNull: boolean, periodFilter: {
        gte: Date;
        lte: Date;
    }): Promise<Admissibilidade[]>;
    getInicialData(status: number, periodFilter: {
        gte: Date;
        lte: Date;
    }): Promise<Inicial[]>;
    verificarData(mes: string, ano: string): PeriodFilterDto;
    getRelatorio(mes: string, ano: string): Promise<{
        total: number;
        analise: number;
        inadmissiveis: number;
        admissiveis: number;
        data_gerado: string;
        em_analise: {
            smul: {
                quantidade: number;
                data: Record<string, number>;
            };
            graproem: {
                quantidade: number;
                data: Record<string, number>;
            };
            parhis: {
                quantidade: number;
                data: Record<string, number>;
            };
            servin: {
                quantidade: number;
                data: Record<string, number>;
            };
            comin: {
                quantidade: number;
                data: Record<string, number>;
            };
            caepp: {
                quantidade: number;
                data: Record<string, number>;
            };
            resid: {
                quantidade: number;
                data: Record<string, number>;
            };
            total_parcial: number;
        };
        deferidos: {
            smul: {
                quantidade: number;
                data: Record<string, number>;
            };
            graproem: {
                quantidade: number;
                data: Record<string, number>;
            };
            parhis: {
                quantidade: number;
                data: Record<string, number>;
            };
            servin: {
                quantidade: number;
                data: Record<string, number>;
            };
            comin: {
                quantidade: number;
                data: Record<string, number>;
            };
            caepp: {
                quantidade: number;
                data: Record<string, number>;
            };
            resid: {
                quantidade: number;
                data: Record<string, number>;
            };
            total_parcial: number;
        };
        indeferidos: {
            smul: {
                quantidade: number;
                data: Record<string, number>;
            };
            graproem: {
                quantidade: number;
                data: Record<string, number>;
            };
            parhis: {
                quantidade: number;
                data: Record<string, number>;
            };
            servin: {
                quantidade: number;
                data: Record<string, number>;
            };
            comin: {
                quantidade: number;
                data: Record<string, number>;
            };
            caepp: {
                quantidade: number;
                data: Record<string, number>;
            };
            resid: {
                quantidade: number;
                data: Record<string, number>;
            };
            total_parcial: number;
        };
        analise_admissiveis_dados: {
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
            envio_admissibilidade: Date | null;
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
        inadmissiveis_dados: {
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
            envio_admissibilidade: Date | null;
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
        em_analise_dados: {
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
            envio_admissibilidade: Date | null;
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
        deferidos_dados: {
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
            envio_admissibilidade: Date | null;
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
        indeferidos_dados: {
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
            envio_admissibilidade: Date | null;
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
        via_ordinaria_dados: {
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
            envio_admissibilidade: Date | null;
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
}
