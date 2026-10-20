import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvisosResponseDTO } from './dto/response.dto';
import { Avisos } from '@prisma/client';
export declare class AvisosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAvisoDto: CreateAvisoDto, usuario_id?: string): Promise<AvisosResponseDTO>;
    findOne(data: Date, usuario_id: string): Promise<({
        inicial: {
            id: number;
            status: number | null;
            criado_em: Date;
            alterado_em: Date;
            decreto: boolean;
            sei: string;
            tipo_requerimento: number;
            requerimento: string;
            aprova_digital: string | null;
            processo_fisico: string | null;
            data_protocolo: Date;
            envio_admissibilidade: Date | null;
            alvara_tipo_id: string;
            tipo_processo: number | null;
            etapa_analise: number | null;
            substatus_analise: number | null;
            obs: string | null;
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
        id: string;
        criado_em: Date;
        alterado_em: Date;
        data: Date;
        inicial_id: number;
        usuario_id: string | null;
        descricao: string;
        titulo: string;
    })[]>;
    buscarPorMesAno(mes: number, ano: number, usuario_id: string): Promise<Avisos[]>;
    update(id: string, updateAvisoDto: UpdateAvisoDto): Promise<AvisosResponseDTO>;
    remove(id: string): Promise<AvisosResponseDTO>;
}
