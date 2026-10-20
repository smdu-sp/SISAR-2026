import { Permissao, Usuario } from '@prisma/client';
import { DefinirPermissoesDto } from './dto/definir-permissoes.dto';
import { PermissoesService } from './permissoes.service';
export declare class PermissoesController {
    private readonly service;
    constructor(service: PermissoesService);
    meusRecursos(usuario: Usuario): Promise<{
        recursos: string[];
    }>;
    matriz(): Promise<{
        recursos: import("./recursos").Recurso[];
        perfis: import(".prisma/client").$Enums.Permissao[];
        travado: string;
        matriz: Record<Permissao, string[]>;
    }>;
    definir(perfil: Permissao, dto: DefinirPermissoesDto): Promise<{
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
}
