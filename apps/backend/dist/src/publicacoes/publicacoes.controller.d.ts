import { PublicacoesService } from './publicacoes.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';
export declare class PublicacoesController {
    private readonly service;
    constructor(service: PublicacoesService);
    criar(dto: CreatePublicacaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        unidade_id: string;
        data_publicacao: Date;
        data_emissao: Date;
        numero_processo: string;
        tipo_documento: import(".prisma/client").$Enums.Tipo_Documento;
        colegiado: import(".prisma/client").$Enums.Colegiado;
        prazo: number;
        tecnico_id: string;
    }>;
    buscarTudo(pagina?: string, limite?: string, busca?: string, tipo_documento?: string, colegiado?: string): Promise<{
        total: number;
        pagina: number;
        limite: number;
        data: ({
            tecnico: {
                id: string;
                nome: string;
                login: string;
                email: string;
                cargo: import(".prisma/client").$Enums.Cargo;
                permissao: import(".prisma/client").$Enums.Permissao;
                status: number;
                criado_em: Date;
                alterado_em: Date;
                unidade_id: string | null;
            };
            unidade: {
                id: string;
                nome: string;
                status: number;
                sigla: string | null;
                codigo: string | null;
                nivel: import(".prisma/client").$Enums.Nivel_Unidade;
                unidade_pai_id: string | null;
            };
        } & {
            id: string;
            criado_em: Date;
            alterado_em: Date;
            unidade_id: string;
            data_publicacao: Date;
            data_emissao: Date;
            numero_processo: string;
            tipo_documento: import(".prisma/client").$Enums.Tipo_Documento;
            colegiado: import(".prisma/client").$Enums.Colegiado;
            prazo: number;
            tecnico_id: string;
        })[];
    }>;
    buscarPorId(id: string): Promise<{
        tecnico: {
            id: string;
            nome: string;
            login: string;
            email: string;
            cargo: import(".prisma/client").$Enums.Cargo;
            permissao: import(".prisma/client").$Enums.Permissao;
            status: number;
            criado_em: Date;
            alterado_em: Date;
            unidade_id: string | null;
        };
        unidade: {
            id: string;
            nome: string;
            status: number;
            sigla: string | null;
            codigo: string | null;
            nivel: import(".prisma/client").$Enums.Nivel_Unidade;
            unidade_pai_id: string | null;
        };
    } & {
        id: string;
        criado_em: Date;
        alterado_em: Date;
        unidade_id: string;
        data_publicacao: Date;
        data_emissao: Date;
        numero_processo: string;
        tipo_documento: import(".prisma/client").$Enums.Tipo_Documento;
        colegiado: import(".prisma/client").$Enums.Colegiado;
        prazo: number;
        tecnico_id: string;
    }>;
    atualizar(id: string, dto: UpdatePublicacaoDto): Promise<{
        id: string;
        criado_em: Date;
        alterado_em: Date;
        unidade_id: string;
        data_publicacao: Date;
        data_emissao: Date;
        numero_processo: string;
        tipo_documento: import(".prisma/client").$Enums.Tipo_Documento;
        colegiado: import(".prisma/client").$Enums.Colegiado;
        prazo: number;
        tecnico_id: string;
    }>;
}
