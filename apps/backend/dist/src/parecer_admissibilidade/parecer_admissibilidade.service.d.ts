import { CreateParecerAdmissibilidadeDto } from './dto/create-parecer_admissibilidade.dto';
import { UpdateParecerAdmissibilidadeDto } from './dto/update-parecer_admissibilidade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { ParecerAdmissibilidadePaginadoDTO, ParecerAdmissibilidadeResponseDTO } from './dto/parecer_admissibilidade-resopnse.dto';
export declare class ParecerAdmissibilidadeService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    criar(createParecerAdmissibilidadeDto: CreateParecerAdmissibilidadeDto): Promise<ParecerAdmissibilidadeResponseDTO>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<ParecerAdmissibilidadePaginadoDTO>;
    buscarPorId(id: string): Promise<ParecerAdmissibilidadeResponseDTO>;
    atualizar(id: string, updateParecerAdmissibilidadeDto: UpdateParecerAdmissibilidadeDto): Promise<ParecerAdmissibilidadeResponseDTO>;
    desativar(id: string): Promise<ParecerAdmissibilidadeResponseDTO>;
}
