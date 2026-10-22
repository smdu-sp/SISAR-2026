import { CreateSubprefeituraDto } from './dto/create-subprefeitura.dto';
import { UpdateSubprefeituraDto } from './dto/update-subprefeitura.dto';
import { PrismaService } from '../config/prisma';
import { AppService } from '../app.service';
import { CreateResponseSubprefeituraDTO, SubprefeituraResponseDTO } from './dto/subprefeitura-response.dto';
import { Subprefeitura } from '@prisma/client';
export declare class SubprefeituraService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    listaCompleta(): Promise<SubprefeituraResponseDTO[]>;
    buscaPorNome(nome: string): Promise<SubprefeituraResponseDTO>;
    criar(createsubprefeituraDto: CreateSubprefeituraDto): Promise<CreateResponseSubprefeituraDTO>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: Subprefeitura[];
    }>;
    buscarPorId(id: string): Promise<SubprefeituraResponseDTO>;
    atualizar(id: string, updatesubprefeituraDto: UpdateSubprefeituraDto): Promise<SubprefeituraResponseDTO>;
    desativar(id: string): Promise<{
        message: string;
    }>;
}
