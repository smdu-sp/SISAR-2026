import { AlvaraTipoService } from './alvara-tipo.service';
import { CreateAlvaraTipoDto } from './dto/create-alvara-tipo.dto';
import { UpdateAlvaraTipoDto } from './dto/update-alvara-tipo.dto';
import { AlvaraTipoPaginadoDTO, AlvaraTipoResponseDTO } from './dto/alvara-tipo-responses.dto';
export declare class AlvaraTipoController {
    private readonly alvaraTipoService;
    constructor(alvaraTipoService: AlvaraTipoService);
    criar(createAlvaraTipoDto: CreateAlvaraTipoDto): Promise<AlvaraTipoResponseDTO>;
    listaCompleta(): Promise<AlvaraTipoResponseDTO[]>;
    buscarTudo(pagina: number, limite: number, busca?: string): Promise<AlvaraTipoPaginadoDTO>;
    buscarPorId(id: string): Promise<AlvaraTipoResponseDTO>;
    atualizar(id: string, updateAlvaraTipoDto: UpdateAlvaraTipoDto): Promise<AlvaraTipoResponseDTO>;
    auterarStatus(id: string, updateAlvaraTipoDto: UpdateAlvaraTipoDto): Promise<AlvaraTipoResponseDTO>;
}
