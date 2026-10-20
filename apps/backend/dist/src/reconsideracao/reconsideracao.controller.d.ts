import { ReconsideracaoService } from './reconsideracao.service';
import { RegistrarPedidoReconsideracaoDto } from './dto/registrar-pedido.dto';
export declare class ReconsideracaoController {
    private readonly service;
    constructor(service: ReconsideracaoService);
    buscar(inicialId: string): Promise<{
        criado_em: Date;
        alterado_em: Date;
        parecer: boolean;
        publicacao: Date | null;
        inicial_id: number;
        envio: Date | null;
        pedido_reconsideracao: Date | null;
    }>;
    registrarPedido(inicialId: string, dto: RegistrarPedidoReconsideracaoDto): Promise<{
        mensagem: string;
    }>;
    aceitar(inicialId: string): Promise<{
        mensagem: string;
    }>;
    rejeitar(inicialId: string): Promise<{
        mensagem: string;
    }>;
}
