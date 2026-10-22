import { container } from '../container';
import { UnauthorizedException } from '../http/errors';
import { controller, rota } from '../http/roteador';
import { validarDto } from '../http/validar';
import { LoginRequestBody } from './models/LoginRequestBody';
/** Antigo AuthController (@Controller()): login, refresh e eu. */
export const rotasAuth = controller('', [
    rota.post('login', async (ctx) => {
        const corpo = await ctx.corpo();
        // ValidarLoginMiddleware: valida o corpo antes da estratégia local.
        await validarDto(LoginRequestBody, { login: corpo.login, senha: corpo.senha }, { whitelist: false });
        // LocalAuthGuard: qualquer falha na validação vira 401 com a mensagem original.
        let usuario;
        try {
            usuario = await container().auth.validateUser(corpo.login, corpo.senha);
        }
        catch (erro) {
            throw new UnauthorizedException(erro?.message);
        }
        if (!usuario)
            throw new UnauthorizedException();
        return container().auth.login(usuario);
    }, { publica: true, status: 200 }),
    rota.post('refresh', (ctx) => container().auth.refresh(ctx.usuario), {
        autenticacao: 'refresh',
    }),
    rota.get('eu', (ctx) => ctx.usuario, { recursos: ['*'] }),
]);
