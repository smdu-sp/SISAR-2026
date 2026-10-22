import { UpdateReunioesDto } from './dto/update-reunioes.dto';
import { PrismaService } from '../config/prisma';
import { Reuniao_Processo } from '@prisma/client';
export declare class ReunioesService {
    private prisma;
    constructor(prisma: PrismaService);
    listaCompleta(): Promise<Reuniao_Processo[]>;
    buscarPorMesAno(mes: number, ano: number): Promise<Reuniao_Processo[]>;
    buscarPorId(idInt: string): Promise<Reuniao_Processo>;
    buscarPorInicial(inicialId: number): Promise<Reuniao_Processo[]>;
    atualizarData(id: string, updateReunioesDto: UpdateReunioesDto): Promise<Reuniao_Processo>;
    buscarPorData(data: Date): Promise<Reuniao_Processo[]>;
}
