import { ParecerAdmissibilidadeService } from './parecer_admissibilidade.service';
import { CreateParecerAdmissibilidadeDto } from './dto/create-parecer_admissibilidade.dto';
import { UpdateParecerAdmissibilidadeDto } from './dto/update-parecer_admissibilidade.dto';
import { ParecerAdmissibilidadePaginadoDTO, ParecerAdmissibilidadeResponseDTO } from './dto/parecer_admissibilidade-resopnse.dto';
export declare class ParecerAdmissibilidadeController {
    private readonly parecerAdmissibilidadeService;
    constructor(parecerAdmissibilidadeService: ParecerAdmissibilidadeService);
    create(createParecerAdmissibilidadeDto: CreateParecerAdmissibilidadeDto): Promise<ParecerAdmissibilidadeResponseDTO>;
    buscarTudo(pagina?: string, limite?: string, busca?: string): Promise<ParecerAdmissibilidadePaginadoDTO>;
    buscarPorId(id: string): Promise<ParecerAdmissibilidadeResponseDTO>;
    atualizar(id: string, updateParecerAdmissibilidadeDto: UpdateParecerAdmissibilidadeDto): Promise<ParecerAdmissibilidadeResponseDTO>;
    desativar(id: string): Promise<ParecerAdmissibilidadeResponseDTO>;
}
