import { CreateMotivoInadmissaoDto } from './dto/create-motivo-inadmissao.dto';
import { UpdateMotivoInadmissaoDto } from './dto/update-motivo-inadmissao.dto';
import { MotivoInadmissaoService } from './motivo-inadmissao.service';
export declare class MotivoInadmissaoController {
    private readonly service;
    constructor(service: MotivoInadmissaoService);
    criar(dto: CreateMotivoInadmissaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        descricao: string;
    }>;
    buscarTudo(pagina?: string, limite?: string, busca?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            descricao: string;
        }[];
    }>;
    listaCompleta(): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        descricao: string;
    }[]>;
    buscarPorId(id: string): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        descricao: string;
    }>;
    atualizar(id: string, dto: UpdateMotivoInadmissaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        descricao: string;
    }>;
    remover(id: string): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        descricao: string;
    }>;
}
