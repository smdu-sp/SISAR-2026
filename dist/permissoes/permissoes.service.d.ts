import { Permissao } from '@prisma/client';
import { PrismaService } from '../config/prisma';
export declare class PermissoesService {
    private readonly prisma;
    private cache;
    private cacheExpiraEm;
    constructor(prisma: PrismaService);
    /** Banco recém-criado sem a matriz: aplica o padrão. */
    onModuleInit(): Promise<void>;
    temAlgum(perfil: Permissao, chaves: string[]): Promise<boolean>;
    recursosDoPerfil(perfil: Permissao): Promise<string[]>;
    matriz(): Promise<{
        recursos: import("./recursos").Recurso[];
        perfis: import(".prisma/client").$Enums.Permissao[];
        travado: string;
        matriz: Record<Permissao, string[]>;
    }>;
    definir(perfil: Permissao, recursos: string[]): Promise<{
        recursos: import("./recursos").Recurso[];
        perfis: import(".prisma/client").$Enums.Permissao[];
        travado: string;
        matriz: Record<Permissao, string[]>;
    }>;
    restaurarPadrao(): Promise<{
        recursos: import("./recursos").Recurso[];
        perfis: import(".prisma/client").$Enums.Permissao[];
        travado: string;
        matriz: Record<Permissao, string[]>;
    }>;
    private invalidar;
    private carregar;
}
