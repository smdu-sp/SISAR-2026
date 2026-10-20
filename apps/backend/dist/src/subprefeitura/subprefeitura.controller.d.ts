import { SubprefeituraService } from './subprefeitura.service';
import { CreateSubprefeituraDto } from './dto/create-subprefeitura.dto';
import { UpdateSubprefeituraDto } from './dto/update-subprefeitura.dto';
import { CreateResponseSubprefeituraDTO, SubprefeituraPaginatedResponseDTO, SubprefeituraResponseDTO } from './dto/subprefeitura-response.dto';
export declare class SubprefeituraController {
    private readonly subprefeiturasServiceimport;
    constructor(subprefeiturasServiceimport: SubprefeituraService);
    criar(CreateSubprefeituraDto: CreateSubprefeituraDto): Promise<CreateResponseSubprefeituraDTO>;
    buscarTudo(pagina?: string, limite?: string, busca?: string): Promise<SubprefeituraPaginatedResponseDTO>;
    listaCompleta(): Promise<SubprefeituraResponseDTO[]>;
    buscarPorId(id: string): Promise<SubprefeituraResponseDTO>;
    atualizar(id: string, updateUnidadeDto: UpdateSubprefeituraDto): Promise<SubprefeituraResponseDTO>;
}
