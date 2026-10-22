import { PrismaService } from '../../config/prisma';
import { ImportarInicialResponseDTO } from '../dto/importar-inicial.dto';
export declare function normalizarNomeSubprefeitura(valor: string): string;
export declare function siglaSubprefeitura(valor: string): string;
/**
 * Importa processos com histórico completo a partir da planilha .xlsx revisada
 * pelos usuários. Não-destrutivo (adiciona; SEIs já existentes = duplicados),
 * cada processo numa transação própria.
 *
 * Estrutura da planilha:
 * - Cabeçalho técnico na linha cuja coluna 1 é `sei`/`processo` (linha 1 pode
 *   ser um rótulo amigável); dados começam na linha seguinte.
 * - Abas-filhas ligadas pelo SEI (coluna `sei` ou `processo`).
 * - Decisoes/Reunioes: blocos de instância lado a lado (uma linha por processo).
 * - SQLs: um SQL por coluna (uma linha por processo).
 */
export declare class ImportadorPlanilha {
    private prisma;
    constructor(prisma: PrismaService);
    private valorCelula;
    private norm;
    private adicionarAliasSubprefeitura;
    private garantirSubprefeitura;
    private chaveHeader;
    private ehSim;
    private data;
    private int;
    /** Aceita número (1/0) ou SIM/NAO -> 1/0. undefined se vazio. */
    private intOuSim;
    private semMascara;
    private tipoProcesso;
    private parecerDecisao;
    private aba;
    /** Linha do cabeçalho técnico = primeira (1..4) cuja col.1 é sei/processo. */
    private linhaHeader;
    private headers;
    private seiDeLinha;
    /** Lê aba "tall": uma linha = um registro; agrupa por SEI. */
    private lerAgrupado;
    /** Lê aba com blocos de instância lado a lado; agrupa por SEI. */
    private lerBlocos;
    /** Lê a aba SQLs no formato "um SQL por coluna"; agrupa por SEI. */
    private lerSqls;
    executar(buffer: Buffer): Promise<ImportarInicialResponseDTO>;
    /** Aba Processos: uma linha = um processo (com nº da linha no Excel). */
    private lerAgrupadoPlano;
    private montarFilhos;
}
