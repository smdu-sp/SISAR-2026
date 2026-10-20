import { CreateDistribuicaoDto } from './dto/create-distribuicao.dto';
import { UpdateDistribuicaoDto } from './dto/update-distribuicao.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DistribuicaoResponseDTO } from './dto/distribuicao-response.dto';
export declare class DistribuicaoService {
    private prisma;
    constructor(prisma: PrismaService);
    criar(createDistribuicaoDto: CreateDistribuicaoDto): Promise<DistribuicaoResponseDTO>;
    atualizar(inicial_id: number, updateDistribuicaoDto: UpdateDistribuicaoDto): Promise<DistribuicaoResponseDTO>;
    mudarAdministrativoResponsavel(inicial_id: number, administrativo_responsavel_id: string): Promise<DistribuicaoResponseDTO>;
    mudarTecnicoResponsavel(inicial_id: number, tecnico_responsavel_id: string): Promise<DistribuicaoResponseDTO>;
}
