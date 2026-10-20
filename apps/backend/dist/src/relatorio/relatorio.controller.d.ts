import { Response } from 'express';
import { RelatorioService } from './relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from './relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from './ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from './relatorio-complementar/relatorio-complementar.service';
import { RelatorioExportacaoService } from './exportacao/relatorio-exportacao.service';
import { EnviarRelatorioEmailDto } from './dto/enviar-relatorio-email.dto';
import { RelatorioEmailService } from './email/relatorio-email.service';
export declare class RelatorioController {
    private readonly relatorioService;
    private readonly relatorioRRService;
    private readonly arGraficoProgressaoMensal;
    private readonly relatorioComplementarService;
    private readonly relatorioExportacaoService;
    private readonly relatorioEmailService;
    constructor(relatorioService: RelatorioService, relatorioRRService: RelatorioRRService, arGraficoProgressaoMensal: ArGraficoProgressaoMensalService, relatorioComplementarService: RelatorioComplementarService, relatorioExportacaoService: RelatorioExportacaoService, relatorioEmailService: RelatorioEmailService);
    relatorioQuantitativo(mes: string, ano: string): Promise<{
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
    relatorioRequalificaRapido(mes: string, ano: string): Promise<{
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
            status: number;
            criado_em: Date;
            alterado_em: Date;
            unidade_id: string | null;
            obs: string | null;
            inicial_id: number;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            reconsiderado: boolean;
            motivo: number | null;
        }[];
        admissiveis_dados: {
            status: number;
            criado_em: Date;
            alterado_em: Date;
            unidade_id: string | null;
            obs: string | null;
            inicial_id: number;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            reconsiderado: boolean;
            motivo: number | null;
        }[];
        em_analise_dados: {
            status: number;
            criado_em: Date;
            alterado_em: Date;
            unidade_id: string | null;
            obs: string | null;
            inicial_id: number;
            data_envio: Date | null;
            data_decisao_interlocutoria: Date | null;
            parecer_admissibilidade_id: string | null;
            subprefeitura_id: string | null;
            categoria_id: string | null;
            reconsiderado: boolean;
            motivo: number | null;
        }[];
    }>;
    relatorioArGraficoProgressaoMensalIntervalo(anoInicial: string, anoFinal: string): Promise<import("./ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service").ProgressaoMensalAno[]>;
    relatorioArGraficoProgressaoMensal(ano: string): Promise<import("./ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service").ProgressaoMensalAno[]>;
    relatorioArPrazoAnaliseAdmissibilidade(dataInicial: string, dataFinal: string): Promise<{
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
    relatorioRrPrazoAnaliseAdmissibilidade(dataInicial: string, dataFinal: string): Promise<{
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
    relatorioArGabinetePrefeito(): Promise<Record<string, any>[]>;
    exportarRelatorio(tipoRelatorio: string, formato: string, dataInicial: string, dataFinal: string, anoInicial: string, anoFinal: string, periodo: string, res: Response): Promise<Response<any, Record<string, any>>>;
    enviarRelatorioPorEmail(tipoRelatorio: string, formato: string, dto: EnviarRelatorioEmailDto): Promise<{
        id: string;
        filename: string;
        destinatarios: string[];
    }>;
}
