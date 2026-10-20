import { PrismaService } from 'src/prisma/prisma.service';
import { ImportarInicialResponseDTO } from '../dto/importar-inicial.dto';
export declare class ImportadorPlanilha {
    private prisma;
    constructor(prisma: PrismaService);
    private valorCelula;
    private norm;
    private chaveHeader;
    private ehSim;
    private data;
    private int;
    private intOuSim;
    private semMascara;
    private tipoProcesso;
    private parecerDecisao;
    private aba;
    private linhaHeader;
    private headers;
    private seiDeLinha;
    private lerAgrupado;
    private lerBlocos;
    private lerSqls;
    executar(buffer: Buffer): Promise<ImportarInicialResponseDTO>;
    private lerAgrupadoPlano;
    private montarFilhos;
}
