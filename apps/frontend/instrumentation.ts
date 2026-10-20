/** Executado uma vez quando o servidor Next sobe: inicia as tarefas agendadas da API. */
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const { iniciarAgendador } = await import('@sisar/api');
		iniciarAgendador();
	}
}
