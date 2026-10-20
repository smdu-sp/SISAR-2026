import { AnaliseService } from './analise.service';
import { RegistrarPreReuniaoDto } from './dto/registrar-pre-reuniao.dto';
import { RegistrarComuniqueSeDto } from './dto/registrar-comunique-se.dto';
import { RegistrarDecisaoDto } from './dto/registrar-decisao.dto';
import { RespostaComuniqueSeDto } from './dto/resposta-comunique-se.dto';
export declare class AnaliseController {
    private readonly analiseService;
    constructor(analiseService: AnaliseService);
    obterContexto(inicialId: string): Promise<{
        inicial_id: number;
        status: number;
        tipo_processo: number;
        etapa_analise: number;
        substatus_analise: number;
        graproem: boolean;
        data_limiteSmul: Date;
        data_limiteMulti: Date;
        distribuicao: {
            tecnico_responsavel: {
                id: string;
                nome: string;
            };
            administrativo_responsavel: {
                id: string;
                nome: string;
            };
        } & {
            criado_em: Date;
            alterado_em: Date;
            obs: string | null;
            inicial_id: number;
            tecnico_responsavel_id: string | null;
            administrativo_responsavel_id: string | null;
            processo_relacionado_incomum: string | null;
            assunto_processo_relacionado_incomum: string | null;
            baixa_pagamento: number;
        };
        reuniao_atual: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            inicial_id: number;
            instancia: number;
            data_reuniao: Date;
            data_processo: Date;
            nova_data_reuniao: Date | null;
            justificativa_remarcacao: string | null;
            numero_reuniao: string | null;
            parecer_grupo: string | null;
            data_publicacao: Date | null;
        };
        pre_reuniao_completa: boolean;
        comunique_aberto: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            data: Date;
            inicial_id: number;
            etapa: number;
            data_resposta: Date | null;
            graproem: number | null;
            complementar: boolean;
        };
        decisoes: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            parecer: number;
            obs: string | null;
            inicial_id: number;
            motivo: string | null;
            instancia: number | null;
            etapa: number | null;
            publicacao_parecer: Date | null;
            analise_smul: Date | null;
            analise_smc: Date | null;
            analise_sehab: Date | null;
            analise_siurb: Date | null;
            analise_svma: Date | null;
            parecer_tecnico: string | null;
            graproem: number | null;
        }[];
        comunique_ses: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            data: Date;
            inicial_id: number;
            etapa: number;
            data_resposta: Date | null;
            graproem: number | null;
            complementar: boolean;
        }[];
        reunioes: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            inicial_id: number;
            instancia: number;
            data_reuniao: Date;
            data_processo: Date;
            nova_data_reuniao: Date | null;
            justificativa_remarcacao: string | null;
            numero_reuniao: string | null;
            parecer_grupo: string | null;
            data_publicacao: Date | null;
        }[];
        pode_registrar_pre_reuniao: boolean;
        pode_decidir: boolean;
        pode_comunique_se: boolean;
        pode_registrar_resposta_comunique: boolean;
        pode_registrar_recurso: boolean;
        indeferimento_definitivo: boolean;
        max_instancia: number;
    }>;
    registrarPreReuniao(inicialId: string, dto: RegistrarPreReuniaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        inicial_id: number;
        instancia: number;
        data_reuniao: Date;
        data_processo: Date;
        nova_data_reuniao: Date | null;
        justificativa_remarcacao: string | null;
        numero_reuniao: string | null;
        parecer_grupo: string | null;
        data_publicacao: Date | null;
    }>;
    registrarComuniqueSe(inicialId: string, dto: RegistrarComuniqueSeDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        data: Date;
        inicial_id: number;
        etapa: number;
        data_resposta: Date | null;
        graproem: number | null;
        complementar: boolean;
    }>;
    registrarRespostaComuniqueSe(id: string, dto: RespostaComuniqueSeDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        data: Date;
        inicial_id: number;
        etapa: number;
        data_resposta: Date | null;
        graproem: number | null;
        complementar: boolean;
    }>;
    registrarDecisao(inicialId: string, dto: RegistrarDecisaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        data: Date;
        inicial_id: number;
        etapa: number;
        data_resposta: Date | null;
        graproem: number | null;
        complementar: boolean;
    } | {
        resultado: string;
        mensagem: string;
        proxima_acao: string;
        instancia?: undefined;
    } | {
        resultado: string;
        mensagem: string;
        proxima_acao?: undefined;
        instancia?: undefined;
    } | {
        resultado: string;
        mensagem: string;
        proxima_acao: string;
        instancia: number;
    }>;
    registrarRecurso(inicialId: string): Promise<{
        etapa_analise: number;
        substatus_analise: 0 | 3;
        mensagem: string;
    }>;
    encerrarSemRecurso(inicialId: string): Promise<{
        mensagem: string;
    }>;
}
