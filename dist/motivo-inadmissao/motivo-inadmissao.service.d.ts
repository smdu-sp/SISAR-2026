import { Motivo_Inadmissao } from '@prisma/client';
import { AppService } from '../app.service';
import { PrismaService } from '../config/prisma';
import { CreateMotivoInadmissaoDto } from './dto/create-motivo-inadmissao.dto';
import { UpdateMotivoInadmissaoDto } from './dto/update-motivo-inadmissao.dto';
export declare class MotivoInadmissaoService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    criar(dto: CreateMotivoInadmissaoDto): Promise<Motivo_Inadmissao>;
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
    listaCompleta(): Promise<Motivo_Inadmissao[]>;
    buscarPorId(id: string): Promise<Motivo_Inadmissao>;
    atualizar(id: string, dto: UpdateMotivoInadmissaoDto): Promise<Motivo_Inadmissao>;
    remover(id: string): Promise<Motivo_Inadmissao>;
}
