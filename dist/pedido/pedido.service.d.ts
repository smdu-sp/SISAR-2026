import { Pedido } from '@prisma/client';
import { AppService } from '../app.service';
import { PrismaService } from '../config/prisma';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidoService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    criar(dto: CreatePedidoDto): Promise<Pedido>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: {
            criado_em: Date;
            alterado_em: Date;
            id: string;
            descricao: string;
        }[];
    }>;
    listaCompleta(): Promise<Pedido[]>;
    buscarPorId(id: string): Promise<Pedido>;
    atualizar(id: string, dto: UpdatePedidoDto): Promise<Pedido>;
    remover(id: string): Promise<Pedido>;
}
