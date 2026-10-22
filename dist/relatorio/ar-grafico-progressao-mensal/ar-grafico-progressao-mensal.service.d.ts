import { PrismaService } from '../../config/prisma';
export interface ProgressaoMensalAno {
    ano: number;
    mes: number[];
    acc: number[];
}
export declare class ArGraficoProgressaoMensalService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllByYear(year: number): Promise<ProgressaoMensalAno[]>;
    getByYearRange(anoInicial: number, anoFinal: number): Promise<ProgressaoMensalAno[]>;
    private normalizarAno;
}
