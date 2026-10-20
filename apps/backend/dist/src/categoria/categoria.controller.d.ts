import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
export declare class CategoriaController {
    private readonly service;
    constructor(service: CategoriaService);
    criar(dto: CreateCategoriaDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        categoria: string;
        descricao: string;
        divisao: string;
        competencia: string;
    }>;
    buscarTudo(pagina?: string, limite?: string, busca?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            categoria: string;
            descricao: string;
            divisao: string;
            competencia: string;
        }[];
    }>;
    listaCompleta(): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        categoria: string;
        descricao: string;
        divisao: string;
        competencia: string;
    }[]>;
    buscarPorId(id: string): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        categoria: string;
        descricao: string;
        divisao: string;
        competencia: string;
    }>;
    atualizar(id: string, dto: UpdateCategoriaDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        categoria: string;
        descricao: string;
        divisao: string;
        competencia: string;
    }>;
    remover(id: string): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        categoria: string;
        descricao: string;
        divisao: string;
        competencia: string;
    }>;
}
