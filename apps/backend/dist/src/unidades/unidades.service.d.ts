import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { UnidadeResponseDTO } from './dto/unidade-response.dto';
import { Nivel_Unidade, Unidade } from '@prisma/client';
export declare class UnidadesService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    listaCompleta(nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO[]>;
    arvore(busca?: string): Promise<({
        id: string;
        nome: string;
        status: number;
        sigla: string | null;
        codigo: string | null;
        nivel: import(".prisma/client").$Enums.Nivel_Unidade;
        unidade_pai_id: string | null;
    } & {
        filhas: unknown[];
    })[]>;
    buscaPorCodigo(codigo: string): Promise<UnidadeResponseDTO>;
    buscaPorSigla(sigla: string): Promise<UnidadeResponseDTO>;
    buscaPorNome(nome: string, nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO>;
    private validarHierarquia;
    criar(createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDTO>;
    buscarTudo(pagina?: number, limite?: number, busca?: string, filtro?: number, nivel?: Nivel_Unidade): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: Unidade[];
    }>;
    buscarPorId(id: string): Promise<UnidadeResponseDTO>;
    atualizar(id: string, updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDTO>;
    desativar(id: string): Promise<{
        message: string;
    }>;
}
