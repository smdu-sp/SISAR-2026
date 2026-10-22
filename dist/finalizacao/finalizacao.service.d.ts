import { CreateFinalizacaoDto } from './dto/create-finalizacao.dto';
import { UpdateFinalizacaoDto } from './dto/update-finalizacao.dto';
import { PrismaService } from '../config/prisma';
import { AppService } from '../app.service';
import { FinalizacaoPaginado } from './dto/finalizacao-response.dto';
import { Conclusao } from '@prisma/client';
export declare class FinalizacaoService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    private parseDataCampo;
    criar(createFinalizacaoDto: CreateFinalizacaoDto): Promise<Conclusao>;
    buscarTudo(pagina?: number, limite?: number, busca?: string): Promise<FinalizacaoPaginado>;
    buscaId(id: number): Promise<Conclusao>;
    atualizar(id: number, updateFinalizacaoDto: UpdateFinalizacaoDto): Promise<Conclusao>;
}
