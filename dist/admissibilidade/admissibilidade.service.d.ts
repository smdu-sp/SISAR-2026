import { CreateAdmissibilidadeDto } from './dto/create-admissibilidade.dto';
import { UpdateAdmissibilidadeDto } from './dto/update-admissibilidade.dto';
import { AdmitirDto, InadmitirDto } from './dto/admitir.dto';
import { PrismaService } from '../config/prisma';
import { AppService } from '../app.service';
import { Admissibilidade, Inicial } from '@prisma/client';
import { AdmissibilidadePaginado, AdmissibilidadeResponseDTO, CreateResponseAdmissibilidadeDTO } from './dto/responses.dto';
interface DiasUteis {
    diasUteis: [];
    dataExpiracao: String;
}
export declare class AdmissibilidadeService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    create(createAdmissibilidadeDto: CreateAdmissibilidadeDto): Promise<CreateResponseAdmissibilidadeDTO>;
    listaCompleta(): Promise<AdmissibilidadeResponseDTO[]>;
    contarForaDoPrazo(): Promise<number>;
    contarDentroDoPrazo(): Promise<number>;
    admissibilidadeFinalizada(): Promise<number>;
    buscarTudo(pagina: number, limite: number, filtro: number, busca?: string): Promise<AdmissibilidadePaginado>;
    findAll(): Promise<AdmissibilidadeResponseDTO[]>;
    buscarPorId(id: number): Promise<Admissibilidade>;
    ultimaAtualizacao(id: number): Promise<Inicial>;
    atualizarStatus(id: number, updateAdmissibilidadeDto: UpdateAdmissibilidadeDto): Promise<Admissibilidade>;
    admitir(inicialId: number, dto: AdmitirDto): Promise<Admissibilidade>;
    inadmitir(inicialId: number, dto: InadmitirDto): Promise<Admissibilidade>;
    remove(id: number): string;
    verificaDiasUteis(data: string, dias: number): Promise<DiasUteis>;
    dataExperacaoNaoUtil(data: string, dias: number): Date;
    /** Antes @Cron(EVERY_DAY_AT_6AM): agora disparado por src/agendador.ts. */
    verificaReconsideracao(): Promise<{
        inicial: {
            tipo_processo: number;
            alvara_tipo: {
                reconsideracao_smul: number;
                reconsideracao_smul_tipo: number;
                reconsideracao_multi: number;
                reconsideracao_multi_tipo: number;
            };
        };
        inicial_id: number;
        data_decisao_interlocutoria: Date;
    }[]>;
    medianaTempoAdmissibilidade(): Promise<number | null>;
    registrosAdmissibilidadeFinalizada(): Promise<{
        dataDecisaoInterlocutoria: Date;
        sei: string;
        envioAdmissibilidade: Date;
        dias: number;
        status: string;
    }[]>;
    private enriquecerDataEnvio;
    private parseDataCampo;
    private toAdmissibilidadeData;
}
export {};
