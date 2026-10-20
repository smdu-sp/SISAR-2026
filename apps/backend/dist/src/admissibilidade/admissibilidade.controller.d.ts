import { AdmissibilidadeService } from './admissibilidade.service';
import { CreateAdmissibilidadeDto } from './dto/create-admissibilidade.dto';
import { UpdateAdmissibilidadeDto } from './dto/update-admissibilidade.dto';
import { AdmitirDto, InadmitirDto } from './dto/admitir.dto';
import { AdmissibilidadePaginado, AdmissibilidadeResponseDTO, CreateResponseAdmissibilidadeDTO } from './dto/responses.dto';
export declare class AdmissibilidadeController {
    private readonly admissibilidadeService;
    constructor(admissibilidadeService: AdmissibilidadeService);
    create(createAdmissibilidadeDto: CreateAdmissibilidadeDto): Promise<CreateResponseAdmissibilidadeDTO>;
    findAll(): Promise<AdmissibilidadeResponseDTO[]>;
    buscarTudo(pagina: number, limite: number, filtro: number, busca: string): Promise<AdmissibilidadePaginado>;
    buscarPorId(id: string): Promise<AdmissibilidadeResponseDTO>;
    listaCompleta(): Promise<AdmissibilidadeResponseDTO[]>;
    atulaizarStatus(id: string, updateAdmissibilidadeDto: UpdateAdmissibilidadeDto): Promise<AdmissibilidadeResponseDTO>;
    admitir(inicialId: string, dto: AdmitirDto): Promise<AdmissibilidadeResponseDTO>;
    inadmitir(inicialId: string, dto: InadmitirDto): Promise<AdmissibilidadeResponseDTO>;
    remove(id: string): string;
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
    contarRegistros(): Promise<number>;
    contarDentroPrazo(): Promise<number>;
    admissibilidadeFinalizada(): Promise<number>;
    medianaAdmissibilidade(): Promise<number>;
    registrosAdmibilidade(): Promise<{
        dataDecisaoInterlocutoria: Date;
        sei: string;
        envioAdmissibilidade: Date;
        dias: number;
        status: string;
    }[]>;
}
