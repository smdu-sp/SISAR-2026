import { Categoria } from '@prisma/client';
import { AppService } from '../app.service';
import { PrismaService } from '../config/prisma';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
export declare class CategoriaService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    criar(dto: CreateCategoriaDto): Promise<Categoria>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: {
            categoria: string;
            criado_em: Date;
            alterado_em: Date;
            id: string;
            descricao: string;
            divisao: string;
            competencia: string;
        }[];
    }>;
    listaCompleta(): Promise<Categoria[]>;
    buscarPorId(id: string): Promise<Categoria>;
    atualizar(id: string, dto: UpdateCategoriaDto): Promise<Categoria>;
    remover(id: string): Promise<Categoria>;
}
