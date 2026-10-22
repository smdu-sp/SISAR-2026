import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { PrismaService } from '../config/prisma';
import { AvisosResponseDTO } from './dto/response.dto';
import { Avisos } from '@prisma/client';
export declare class AvisosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAvisoDto: CreateAvisoDto, usuario_id?: string): Promise<AvisosResponseDTO>;
    findOne(data: Date, usuario_id: string): Promise<({
        inicial: {
            status: number | null;
            obs: string | null;
            criado_em: Date;
            alterado_em: Date;
            tipo_processo: number | null;
            id: number;
            decreto: boolean;
            sei: string;
            tipo_requerimento: number;
            requerimento: string;
            aprova_digital: string | null;
            processo_fisico: string | null;
            data_protocolo: Date;
            envio_admissibilidade: Date | null;
            alvara_tipo_id: string;
            etapa_analise: number | null;
            substatus_analise: number | null;
            pagamento: number | null;
            requalifica_rapido: boolean | null;
            associado_reforma: boolean | null;
            numero_requerimento: string | null;
            ar_ou_rr: string | null;
            numero_guia_tev: string | null;
            guia_vinculada_outro: boolean | null;
            data_limiteSmul: Date | null;
            data_limiteMulti: Date | null;
        };
    } & {
        inicial_id: number;
        criado_em: Date;
        alterado_em: Date;
        data: Date;
        id: string;
        descricao: string;
        usuario_id: string | null;
        titulo: string;
    })[]>;
    buscarPorMesAno(mes: number, ano: number, usuario_id: string): Promise<Avisos[]>;
    update(id: string, updateAvisoDto: UpdateAvisoDto): Promise<AvisosResponseDTO>;
    remove(id: string): Promise<AvisosResponseDTO>;
}
