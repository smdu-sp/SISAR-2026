import { ForbiddenException } from '@nestjs/common';
import { InicialService } from './inicial.service';
import { CreateInicialDto } from './dto/create-inicial.dto';
import { UpdateInicialDto } from './dto/update-inicial.dto';
import { ImportarInicialResponseDTO } from './dto/importar-inicial.dto';
import { IniciaisPaginado, InicialProcessosMesAnoResponseDTO, InicialProcessosResponseDTO, InicialResponseDTO, SqlResponseDTO } from './dto/inicial-response.dto';
export declare class InicialController {
    private readonly inicialService;
    constructor(inicialService: InicialService);
    criar(createInicialDto: CreateInicialDto): Promise<InicialResponseDTO>;
    importar(arquivo: {
        buffer: Buffer;
    } | undefined): Promise<ImportarInicialResponseDTO>;
    buscarTudo(pagina?: string, limite?: string, busca?: string, status?: string): Promise<IniciaisPaginado>;
    buscarTudoEmAnalise(pagina?: string, limite?: string): Promise<IniciaisPaginado>;
    buscarPorMesAnoProcesso(mes: string, ano: string): Promise<InicialProcessosMesAnoResponseDTO[]>;
    buscarPorId(id: string): Promise<InicialResponseDTO>;
    buscarPorDataProcesso(data: Date): Promise<({
        inicial: {
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
        };
    } & {
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
    })[]>;
    atualizar(id: string, updateInicialDto: UpdateInicialDto): Promise<InicialResponseDTO>;
    adicionaSql(inicial_id: string, { sql }: {
        sql: string;
    }): Promise<SqlResponseDTO | ForbiddenException>;
    removeSql(inicial_id: string, sql: string): Promise<boolean>;
    validaSql(sql: string): Promise<boolean>;
    verificaSei(sei: string): Promise<InicialResponseDTO>;
    todosProcessos(): Promise<InicialProcessosResponseDTO[]>;
}
