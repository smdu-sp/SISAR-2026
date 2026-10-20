import { _paraTestes, agendadorAtivo, tarefas } from '../agendador';

const { diariamente, aCadaMinuto } = _paraTestes;

describe('Agendador', () => {
	it('diário às 06:00: hoje se ainda não passou, senão amanhã', () => {
		const seis = diariamente(6);
		expect(seis(new Date(2026, 9, 21, 5, 59, 59))).toEqual(new Date(2026, 9, 21, 6, 0, 0));
		expect(seis(new Date(2026, 9, 21, 6, 0, 0))).toEqual(new Date(2026, 9, 22, 6, 0, 0));
		expect(seis(new Date(2026, 11, 31, 23, 0))).toEqual(new Date(2027, 0, 1, 6, 0, 0));
	});

	it('a cada minuto: início do próximo minuto', () => {
		expect(aCadaMinuto(new Date(2026, 9, 21, 10, 15, 42, 500))).toEqual(new Date(2026, 9, 21, 10, 16, 0, 0));
	});

	it('liga por padrão; AGENDADOR=off desliga', () => {
		expect(agendadorAtivo({})).toBe(true);
		expect(agendadorAtivo({ AGENDADOR: 'on' })).toBe(true);
		expect(agendadorAtivo({ AGENDADOR: 'off' })).toBe(false);
	});

	it('mantém a tarefa diária de reconsideração da admissibilidade', () => {
		expect(tarefas.map((t) => t.nome)).toEqual(['reconsideracao-admissibilidade', 'envio-relatorios']);
	});
});
