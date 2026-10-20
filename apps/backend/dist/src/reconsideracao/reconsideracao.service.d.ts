import { PrismaService } from 'src/prisma/prisma.service';
import { InicialService } from 'src/inicial/inicial.service';
import { RegistrarPedidoReconsideracaoDto } from './dto/registrar-pedido.dto';
export declare class ReconsideracaoService {
    private prisma;
    private inicialService;
    constructor(prisma: PrismaService, inicialService: InicialService);
    private parseData;
    registrarPedido(inicialId: number, dto: RegistrarPedidoReconsideracaoDto): Promise<{
        mensagem: string;
    }>;
    aceitar(inicialId: number): Promise<{
        mensagem: string;
    }>;
    rejeitar(inicialId: number): Promise<{
        mensagem: string;
    }>;
    buscar(inicialId: number): Promise<{
        criado_em: Date;
        alterado_em: Date;
        parecer: boolean;
        publicacao: Date | null;
        inicial_id: number;
        envio: Date | null;
        pedido_reconsideracao: Date | null;
    }>;
}
