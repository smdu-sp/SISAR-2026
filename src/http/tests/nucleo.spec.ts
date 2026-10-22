import {
	BadGatewayException,
	BadRequestException,
	ForbiddenException,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '../errors';
import { controller, encontrarRota, montarResposta, respostaDeErro, rota } from '../roteador';

describe('Erros no formato do NestJS', () => {
	it('com mensagem: { message, error, statusCode }', () => {
		expect(new ForbiddenException('Unidade não encontrada.').corpo).toEqual({
			message: 'Unidade não encontrada.',
			error: 'Forbidden',
			statusCode: 403,
		});
		expect(new InternalServerErrorException('x').corpo).toEqual({
			message: 'x',
			error: 'Internal Server Error',
			statusCode: 500,
		});
	});

	it('sem mensagem: { message: <descrição>, statusCode }', () => {
		expect(new UnauthorizedException().corpo).toEqual({ message: 'Unauthorized', statusCode: 401 });
		expect(new NotFoundException().corpo).toEqual({ message: 'Not Found', statusCode: 404 });
	});

	it('lista de mensagens (validação)', () => {
		expect(new BadRequestException(['a', 'b']).corpo).toEqual({
			message: ['a', 'b'],
			error: 'Bad Request',
			statusCode: 400,
		});
	});

	it('objeto é enviado como está', () => {
		const corpo = { message: 'Erro ao enviar email pelo Resend.', error: { name: 'x' } };
		expect(new BadGatewayException(corpo).corpo).toEqual(corpo);
	});

	it('erro desconhecido vira 500 genérico', async () => {
		const espiao = jest.spyOn(console, 'error').mockImplementation(() => {});
		const resposta = respostaDeErro(new Error('falhou'));
		expect(resposta.status).toBe(500);
		expect(await resposta.json()).toEqual({ statusCode: 500, message: 'Internal server error' });
		espiao.mockRestore();
	});
});

describe('Roteador', () => {
	const rotas = [
		...controller('relatorio-agendamentos', [
			rota.get('', () => 'lista'),
			rota.get('status-email', () => 'status'),
			rota.get(':id', () => 'um'),
			rota.post(':id/executar', () => 'exec'),
		]),
		...controller('relatorio', [rota.get('ar/quantitativo/:mes?/:ano?', () => 'q')]),
		...controller('', [rota.post('login', () => 'login')]),
	];

	it('respeita a ordem de declaração (rota fixa antes de :id)', () => {
		expect(encontrarRota(rotas, 'GET', '/relatorio-agendamentos/status-email')?.params).toEqual({});
		expect(encontrarRota(rotas, 'GET', '/relatorio-agendamentos/abc')?.params).toEqual({ id: 'abc' });
		expect(encontrarRota(rotas, 'GET', '/relatorio-agendamentos')).not.toBeNull();
	});

	it('parâmetros opcionais', () => {
		expect(encontrarRota(rotas, 'GET', '/relatorio/ar/quantitativo')?.params).toEqual({
			mes: undefined,
			ano: undefined,
		});
		expect(encontrarRota(rotas, 'GET', '/relatorio/ar/quantitativo/5/2026')?.params).toEqual({
			mes: '5',
			ano: '2026',
		});
	});

	it('método e caminho precisam bater; barra final e maiúsculas são aceitas', () => {
		expect(encontrarRota(rotas, 'POST', '/relatorio-agendamentos/abc')).toBeNull();
		expect(encontrarRota(rotas, 'POST', '/relatorio-agendamentos/abc/executar')).not.toBeNull();
		expect(encontrarRota(rotas, 'post', '/LOGIN/')).not.toBeNull();
		expect(encontrarRota(rotas, 'GET', '/nao-existe')).toBeNull();
	});

	it('decodifica parâmetros', () => {
		expect(encontrarRota(rotas, 'GET', '/relatorio-agendamentos/a%20b')?.params).toEqual({ id: 'a b' });
	});
});

describe('Resposta', () => {
	it('objeto vira JSON', async () => {
		const r = montarResposta({ a: 1 }, 201);
		expect(r.status).toBe(201);
		expect(r.headers.get('content-type')).toContain('application/json');
		expect(await r.json()).toEqual({ a: 1 });
	});

	it('nulo/indefinido vira corpo vazio; texto vira text/html (como o Express)', async () => {
		expect(await montarResposta(undefined, 200).text()).toBe('');
		expect(await montarResposta(null, 200).text()).toBe('');
		const r = montarResposta('This action removes', 200);
		expect(r.headers.get('content-type')).toContain('text/html');
		expect(await r.text()).toBe('This action removes');
	});
});
