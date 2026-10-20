import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoService } from './pedido.service';
export declare class PedidoController {
    private readonly service;
    constructor(service: PedidoService);
    criar(dto: CreatePedidoDto): Promise<{
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
    atualizar(id: string, dto: UpdatePedidoDto): Promise<{
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
