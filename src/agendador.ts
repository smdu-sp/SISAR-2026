/**
 * Agendador de tarefas (substitui o @nestjs/schedule). Iniciado pelo instrumentation.ts do Next.
 * AGENDADOR=off desliga (ex.: segunda instância só para leitura). A reivindicação atômica do envio
 * de relatórios evita duplicidade mesmo com mais de uma instância ligada.
 */
import { container } from './container';
import { Logger } from './http/logger';

const logger = new Logger('Agendador');

interface Tarefa {
	nome: string;
	/** Próxima execução estritamente depois de `apos`. */
	proxima: (apos: Date) => Date;
	executar: () => Promise<unknown>;
}

/** Todo dia em hora:minuto (horário local do servidor, como o cron do Nest). */
function diariamente(hora: number, minuto = 0) {
	return (apos: Date) => {
		const alvo = new Date(apos);
		alvo.setHours(hora, minuto, 0, 0);
		if (alvo <= apos) alvo.setDate(alvo.getDate() + 1);
		return alvo;
	};
}

/** No início de cada minuto. */
function aCadaMinuto(apos: Date) {
	const alvo = new Date(apos);
	alvo.setSeconds(0, 0);
	alvo.setMinutes(alvo.getMinutes() + 1);
	return alvo;
}

export const tarefas: Tarefa[] = [
	{
		// Antes: @Cron(CronExpression.EVERY_DAY_AT_6AM) em AdmissibilidadeService.verificaReconsideracao
		nome: 'reconsideracao-admissibilidade',
		proxima: diariamente(6),
		executar: () => container().admissibilidade.verificaReconsideracao(),
	},
	{
		// Antes: @Cron(CronExpression.EVERY_MINUTE) em RelatorioAgendamentoScheduler
		nome: 'envio-relatorios',
		proxima: aCadaMinuto,
		executar: () => container().relatorioAgendamento.executarVencidos(),
	},
];

export function agendadorAtivo(env = process.env): boolean {
	return env.AGENDADOR !== 'off';
}

const estado = globalThis as unknown as { __sisarAgendador?: boolean };

export function iniciarAgendador() {
	if (estado.__sisarAgendador) return; // evita duplicar na recarga a quente
	if (!agendadorAtivo()) {
		logger.log('desligado (AGENDADOR=off).');
		return;
	}
	estado.__sisarAgendador = true;
	for (const tarefa of tarefas) agendar(tarefa);
	logger.log(`ligado: ${tarefas.map((t) => t.nome).join(', ')}`);
}

function agendar(tarefa: Tarefa) {
	const quando = tarefa.proxima(new Date());
	// setTimeout aceita no máximo ~24,8 dias; as tarefas daqui rodam no máximo diariamente.
	// A próxima execução só é agendada quando a atual termina: não há sobreposição.
	setTimeout(async () => {
		try {
			await tarefa.executar();
		} catch (e) {
			logger.error(`${tarefa.nome} falhou: ${e instanceof Error ? e.message : e}`);
		}
		agendar(tarefa);
	}, Math.max(0, quando.getTime() - Date.now()));
}

export const _paraTestes = { diariamente, aCadaMinuto };
