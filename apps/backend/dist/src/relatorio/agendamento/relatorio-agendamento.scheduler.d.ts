import { RelatorioAgendamentoService } from './relatorio-agendamento.service';
export declare class RelatorioAgendamentoScheduler {
    private readonly agendamentoService;
    private readonly logger;
    private executando;
    constructor(agendamentoService: RelatorioAgendamentoService);
    verificarVencidos(): Promise<void>;
}
