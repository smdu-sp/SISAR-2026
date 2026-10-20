import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { UnidadeResponseDTO } from './dto/unidade-response.dto';
import { Nivel_Unidade } from '@prisma/client';
export declare class UnidadesController {
    private readonly unidadesService;
    constructor(unidadesService: UnidadesService);
    criar(createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDTO>;
    buscarTudo(pagina?: string, limite?: string, busca?: string, filtro?: string, nivel?: Nivel_Unidade): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: import(".prisma/client").Unidade[];
    }>;
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
    listaCompleta(nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO[]>;
    buscarPorId(id: string): Promise<UnidadeResponseDTO>;
    atualizar(id: string, updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDTO>;
    desativar(id: string): Promise<{
        message: string;
    }>;
}
