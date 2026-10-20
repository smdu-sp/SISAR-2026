import { Pedido } from '@prisma/client';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
            id: string;
            criado_em: Date;
            alterado_em: Date;
            descricao: string;
        }[];
    }>;
    listaCompleta(): Promise<Pedido[]>;
    buscarPorId(id: string): Promise<Pedido>;
    atualizar(id: string, dto: UpdatePedidoDto): Promise<Pedido>;
    remover(id: string): Promise<Pedido>;
}
