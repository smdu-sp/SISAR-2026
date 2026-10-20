import { FinalizacaoService } from './finalizacao.service';
import { CreateFinalizacaoDto } from './dto/create-finalizacao.dto';
import { UpdateFinalizacaoDto } from './dto/update-finalizacao.dto';
export declare class FinalizacaoController {
    private readonly finalizacaoService;
    constructor(finalizacaoService: FinalizacaoService);
    create(createFinalizacaoDto: CreateFinalizacaoDto): Promise<{
        criado_em: Date;
        alterado_em: Date;
        obs: string;
        inicial_id: number;
        data_apostilamento: Date | null;
        data_conclusao: Date | null;
        data_emissao: Date | null;
        data_outorga: Date | null;
        data_resposta: Date | null;
        data_termo: Date | null;
        num_alvara: string;
        outorga: boolean;
    }>;
    findAll(pagina?: string, limite?: string, busca?: string): Promise<import("./dto/finalizacao-response.dto").FinalizacaoPaginado>;
    findOne(id: string): Promise<{
        criado_em: Date;
        alterado_em: Date;
        obs: string;
        inicial_id: number;
        data_apostilamento: Date | null;
        data_conclusao: Date | null;
        data_emissao: Date | null;
        data_outorga: Date | null;
        data_resposta: Date | null;
        data_termo: Date | null;
        num_alvara: string;
        outorga: boolean;
    }>;
    update(id: string, updateFinalizacaoDto: UpdateFinalizacaoDto): Promise<{
        criado_em: Date;
        alterado_em: Date;
        obs: string;
        inicial_id: number;
        data_apostilamento: Date | null;
        data_conclusao: Date | null;
        data_emissao: Date | null;
        data_outorga: Date | null;
        data_resposta: Date | null;
        data_termo: Date | null;
        num_alvara: string;
        outorga: boolean;
    }>;
}
