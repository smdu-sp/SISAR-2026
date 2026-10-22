import { Admissibilidade, Unidade } from '@prisma/client';
import { PrismaService } from '../../config/prisma';
export declare class RelatorioRRService {
    private prisma;
    constructor(prisma: PrismaService);
    getUnidades(): Promise<Partial<Unidade>[]>;
    countByUnidade(status: number, tipo: number, unidadeIds: string[], periodFilter: {
        gte: Date;
        lte: Date;
    }): Promise<Record<string, number>>;
    countTotal(status: number, decisaoNull: boolean, periodFilter: {
        gte: Date;
        lte: Date;
    }): Promise<number>;
    getData(status: number, decisaoNull: boolean, periodFilter: {
        gte: Date;
        lte: Date;
    }): Promise<Admissibilidade[]>;
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
        };
        inadmissiveis_dados: {
            inicial_id: number;
            unidade_id: string | null;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            status: number;
            reconsiderado: boolean;
            motivo: number | null;
            obs: string | null;
            criado_em: Date;
            alterado_em: Date;
        }[];
        admissiveis_dados: {
            inicial_id: number;
            unidade_id: string | null;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            status: number;
            reconsiderado: boolean;
            motivo: number | null;
            obs: string | null;
            criado_em: Date;
            alterado_em: Date;
        }[];
        em_analise_dados: {
            inicial_id: number;
            unidade_id: string | null;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            status: number;
            reconsiderado: boolean;
            motivo: number | null;
            obs: string | null;
            criado_em: Date;
            alterado_em: Date;
        }[];
    }>;
}
