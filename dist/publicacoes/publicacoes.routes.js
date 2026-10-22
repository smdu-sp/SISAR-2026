import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('publicacoes'). */
export const rotasPublicacoes = controller('publicacoes', [
    // criar
    rota.post('criar', async (ctx) => {
        const dto = await ctx.corpo();
        return container().publicacoes.criar(dto);
    }, { recursos: ['publicacoes'], status: 201 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        const tipo_documento = ctx.query('tipo_documento');
        const colegiado = ctx.query('colegiado');
        return container().publicacoes.buscarTudo(+pagina, +limite, busca, tipo_documento, colegiado);
    }, { status: 200 }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().publicacoes.buscarPorId(id);
    }, { status: 200 }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const dto = await ctx.corpo();
        return container().publicacoes.atualizar(id, dto);
    }, { recursos: ['publicacoes'], status: 200 }),
]);
