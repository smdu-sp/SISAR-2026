export declare class AppService {
    getHello(): {
        message: string;
    };
    getOla(): {
        message: string;
    };
    verificaPagina(pagina: number, limite: number): number[];
    verificaLimite(pagina: number, limite: number, total: number): number[];
}
