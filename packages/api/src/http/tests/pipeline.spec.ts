import jwt from 'jsonwebtoken';

const usuarios = { buscarPorId: jest.fn(), validaUsuario: jest.fn(), buscarTudo: jest.fn() };
const permissoes = {
	temAlgum: jest.fn(),
	matriz: jest.fn(),
	recursosDoPerfil: jest.fn(),
};
const auth = { validateUser: jest.fn(), login: jest.fn(), refresh: jest.fn() };

jest.mock('../../container', () => ({
	container: () => ({ usuarios, permissoes, auth }),
}));

import { tratarRequisicao } from '../../api';

process.env.JWT_SECRET = 'segredo-teste';
process.env.RT_SECRET = 'segredo-refresh';
delete process.env.API_PROXY_TARGET;

const token = (sub = 'u1', segredo = process.env.JWT_SECRET) =>
	jwt.sign({ sub, login: 'x', permissao: 'DEV' }, segredo, { expiresIn: '15m' });

function req(metodo: string, caminho: string, opcoes: { token?: string; corpo?: unknown } = {}) {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (opcoes.token) headers.Authorization = `Bearer ${opcoes.token}`;
	return new Request('http://localhost/api' + caminho, {
		method: metodo,
		headers,
		body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
	});
}

const chamar = (r: Request) =>
	tratarRequisicao(r, new URL(r.url).pathname.replace(/^\/api\//, '').split('/'));

describe('Esteira da API (equivalente aos guards do NestJS)', () => {
	beforeEach(() => jest.clearAllMocks());

	it('sem token: 401 no formato do JwtAuthGuard', async () => {
		const r = await chamar(req('GET', '/eu'));
		expect(r.status).toBe(401);
		expect(await r.json()).toEqual({ message: 'Unauthorized', error: 'Unauthorized', statusCode: 401 });
	});

	it('token inválido ou de outro segredo: 401', async () => {
		const r = await chamar(req('GET', '/eu', { token: token('u1', 'outro') }));
		expect(r.status).toBe(401);
	});

	it('usuário removido do banco: 401', async () => {
		usuarios.buscarPorId.mockResolvedValue(null);
		const r = await chamar(req('GET', '/eu', { token: token() }));
		expect(r.status).toBe(401);
		expect(await r.json()).toEqual({ message: 'Unauthorized', statusCode: 401 });
	});

	it('@AcessoLogado: qualquer perfil autenticado', async () => {
		usuarios.buscarPorId.mockResolvedValue({ id: 'u1', permissao: 'GAB_ASC' });
		const r = await chamar(req('GET', '/eu', { token: token() }));
		expect(r.status).toBe(200);
		expect(await r.json()).toEqual({ id: 'u1', permissao: 'GAB_ASC' });
		expect(permissoes.temAlgum).not.toHaveBeenCalled();
	});

	it('@Recurso: consulta a matriz com os recursos da rota', async () => {
		usuarios.buscarPorId.mockResolvedValue({ id: 'u1', permissao: 'ADM' });
		permissoes.temAlgum.mockResolvedValue(true);
		usuarios.buscarTudo.mockResolvedValue({ total: 0 });
		const r = await chamar(req('GET', '/usuarios/buscar-tudo?pagina=2&limite=5', { token: token() }));
		expect(r.status).toBe(200);
		expect(permissoes.temAlgum).toHaveBeenCalledWith('ADM', ['usuarios']);
		expect(usuarios.buscarTudo).toHaveBeenCalledWith(
			{ id: 'u1', permissao: 'ADM' }, 2, 5, undefined, undefined, undefined,
		);
	});

	it('sem permissão: 403 "Forbidden resource"', async () => {
		usuarios.buscarPorId.mockResolvedValue({ id: 'u1', permissao: 'USR' });
		permissoes.temAlgum.mockResolvedValue(false);
		const r = await chamar(req('GET', '/permissoes', { token: token() }));
		expect(r.status).toBe(403);
		expect(await r.json()).toEqual({ message: 'Forbidden resource', error: 'Forbidden', statusCode: 403 });
		expect(permissoes.temAlgum).toHaveBeenCalledWith('USR', ['permissoes']);
	});

	it('login: corpo inválido dá 400 com as mensagens do class-validator', async () => {
		const r = await chamar(req('POST', '/login', { corpo: { login: 1 } }));
		expect(r.status).toBe(400);
		const corpo = await r.json();
		expect(corpo.error).toBe('Bad Request');
		expect(corpo.message).toEqual(
			expect.arrayContaining(['O login precisa ser um texto.', 'A senha precisa ser um texto.']),
		);
	});

	it('login: falha na validação vira 401 com a mensagem original; sucesso responde 200', async () => {
		auth.validateUser.mockRejectedValueOnce(new Error('Credenciais incorretas.'));
		const falha = await chamar(req('POST', '/login', { corpo: { login: 'a', senha: 'b' } }));
		expect(falha.status).toBe(401);
		expect(await falha.json()).toEqual({ message: 'Credenciais incorretas.', error: 'Unauthorized', statusCode: 401 });

		auth.validateUser.mockResolvedValueOnce({ id: 'u1' });
		auth.login.mockResolvedValueOnce({ access_token: 'a', refresh_token: 'r' });
		const ok = await chamar(req('POST', '/login', { corpo: { login: 'a', senha: 'b' } }));
		expect(ok.status).toBe(200);
		expect(await ok.json()).toEqual({ access_token: 'a', refresh_token: 'r' });
	});

	it('refresh: usa o refresh_token do corpo e responde 201', async () => {
		usuarios.buscarPorId.mockResolvedValue({ id: 'u1' });
		auth.refresh.mockResolvedValue({ access_token: 'n' });
		const r = await chamar(req('POST', '/refresh', { corpo: { refresh_token: token('u1', process.env.RT_SECRET) } }));
		expect(r.status).toBe(201);
		expect(auth.refresh).toHaveBeenCalledWith({ id: 'u1' });

		const invalido = await chamar(req('POST', '/refresh', { corpo: { refresh_token: 'x' } }));
		expect(invalido.status).toBe(401);
		expect(await invalido.json()).toEqual({ message: 'Unauthorized', statusCode: 401 });
	});

	it('rota não migrada sem backend configurado: 404 no formato do Nest', async () => {
		const r = await chamar(req('GET', '/nao-migrado/x', { token: token() }));
		expect(r.status).toBe(404);
		expect(await r.json()).toEqual({ message: 'Cannot GET /nao-migrado/x', error: 'Not Found', statusCode: 404 });
	});
});
