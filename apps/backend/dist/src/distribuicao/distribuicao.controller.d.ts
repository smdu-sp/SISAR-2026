import { DistribuicaoService } from './distribuicao.service';
import { CreateDistribuicaoDto } from './dto/create-distribuicao.dto';
import { UpdateDistribuicaoDto } from './dto/update-distribuicao.dto';
import { DistribuicaoResponseDTO } from './dto/distribuicao-response.dto';
export declare class UpdateAdministrativoResponsavelDTO {
    administrativo_responsavel_id: string;
}
export declare class UpdateTecnicoResponsavelDTO {
    tecnico_responsavel_id: string;
}
export declare class DistribuicaoController {
    private readonly distribuicaoService;
    constructor(distribuicaoService: DistribuicaoService);
    criar(createDistribuicaoDto: CreateDistribuicaoDto): Promise<DistribuicaoResponseDTO>;
    atualizar(inicial_id: string, updateDistribuicaoDto: UpdateDistribuicaoDto): Promise<DistribuicaoResponseDTO>;
    mudarAdministrativoResponsavel(inicial_id: string, { administrativo_responsavel_id }: UpdateAdministrativoResponsavelDTO): Promise<DistribuicaoResponseDTO>;
    mudarTecnicoResponsavel(inicial_id: string, { tecnico_responsavel_id }: UpdateTecnicoResponsavelDTO): Promise<DistribuicaoResponseDTO>;
}
