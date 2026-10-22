import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('unidades'). */
export const rotasUnidades = controller('unidades', [
    // criar
    rota.post('criar', async (ctx) => {
        const createUnidadeDto = await ctx.corpo();
        return container().unidades.criar(createUnidadeDto);
    }, { recursos: ['unidades'], status: 201 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        const filtro = ctx.query('filtro');
        const nivel = ctx.query('nivel');
        return container().unidades.buscarTudo(+pagina, +limite, busca, +filtro, nivel);
    }, { recursos: ['unidades', 'relatorios'], status: 200 }),
    // arvore
    rota.get('arvore', (ctx) => {
        const busca = ctx.query('busca');
        return container().unidades.arvore(busca);
    }, { recursos: ['unidades'], status: 200 }),
    // listaCompleta
    rota.get('lista-completa', (ctx) => {
        const nivel = ctx.query('nivel');
        return container().unidades.listaCompleta(nivel);
    }, { recursos: ['unidades'], status: 200 }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().unidades.buscarPorId(id);
    }, { recursos: ['unidades'], status: 200 }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateUnidadeDto = await ctx.corpo();
        return container().unidades.atualizar(id, updateUnidadeDto);
    }, { recursos: ['unidades'], status: 200 }),
    // desativar
    rota.patch('desativar/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().unidades.desativar(id);
    }, { recursos: ['unidades'], status: 200 }),
]);
