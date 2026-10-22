import { $Enums, Publicacao } from '@prisma/client';
import { AppService } from '../app.service';
import { PrismaService } from '../config/prisma';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';
export declare class PublicacoesService {
    private prisma;
    private app;
    constructor(prisma: PrismaService, app: AppService);
    private include;
    private validarRelacionamentos;
    criar(dto: CreatePublicacaoDto): Promise<Publicacao>;
    buscarTudo(pagina?: number, limite?: number, busca?: string, tipo_documento?: string, colegiado?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: ({
            unidade: {
                status: number;
                id: string;
                nome: string;
                sigla: string | null;
                codigo: string | null;
                nivel: $Enums.Nivel_Unidade;
                unidade_pai_id: string | null;
            };
            tecnico: {
                unidade_id: string | null;
                status: number;
                criado_em: Date;
                alterado_em: Date;
                id: string;
                nome: string;
                login: string;
                email: string;
                cargo: $Enums.Cargo;
                permissao: $Enums.Permissao;
            };
        } & {
            unidade_id: string;
            criado_em: Date;
            alterado_em: Date;
            id: string;
            data_emissao: Date;
            data_publicacao: Date;
            numero_processo: string;
            tipo_documento: $Enums.Tipo_Documento;
            colegiado: $Enums.Colegiado;
            prazo: number;
            tecnico_id: string;
        })[];
    }>;
    buscarPorId(id: string): Promise<{
        unidade: {
            status: number;
            id: string;
            nome: string;
            sigla: string | null;
            codigo: string | null;
            nivel: $Enums.Nivel_Unidade;
            unidade_pai_id: string | null;
        };
        tecnico: {
            unidade_id: string | null;
            status: number;
            criado_em: Date;
            alterado_em: Date;
            id: string;
            nome: string;
            login: string;
            email: string;
            cargo: $Enums.Cargo;
            permissao: $Enums.Permissao;
        };
    } & {
        unidade_id: string;
        criado_em: Date;
        alterado_em: Date;
        id: string;
        data_emissao: Date;
        data_publicacao: Date;
        numero_processo: string;
        tipo_documento: $Enums.Tipo_Documento;
        colegiado: $Enums.Colegiado;
        prazo: number;
        tecnico_id: string;
    }>;
    atualizar(id: string, dto: UpdatePublicacaoDto): Promise<Publicacao>;
}
