import { EmailService } from 'src/email/email.service';
import { RelatorioExportacaoService } from '../exportacao/relatorio-exportacao.service';
import { EnviarRelatorioEmailDto } from '../dto/enviar-relatorio-email.dto';
interface ExportarFiltros {
    dataInicial?: string;
    dataFinal?: string;
    anoInicial?: string;
    anoFinal?: string;
    periodo?: string;
}
export declare class RelatorioEmailService {
    private readonly relatorioExportacaoService;
    private readonly emailService;
    constructor(relatorioExportacaoService: RelatorioExportacaoService, emailService: EmailService);
    enviar(tipoRelatorio: string, formato: string, dto: EnviarRelatorioEmailDto): Promise<{
        id: string;
        filename: string;
        destinatarios: string[];
    }>;
    enviarMultiplos(params: {
        tipoRelatorio: string;
        formatos: string[];
        filtros: ExportarFiltros;
        destinatarios: string[];
        assunto?: string;
        mensagem?: string;
    }): Promise<{
        id: string;
        arquivos: any[];
    }>;
    private montarHtml;
    private escapeHtml;
}
export {};
