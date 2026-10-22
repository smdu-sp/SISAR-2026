import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('subprefeitura'). */
export const rotasSubprefeitura = controller('subprefeitura', [
    // criar
    rota.post('criar', async (ctx) => {
        const CreateSubprefeituraDto = await ctx.corpo();
        return container().subprefeitura.criar(CreateSubprefeituraDto);
    }, { recursos: ['subprefeituras'], status: 201 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        return container().subprefeitura.buscarTudo(+pagina, +limite, busca);
    }, { recursos: ['subprefeituras'], status: 200 }),
    // listaCompleta
    rota.get('lista-completa', (ctx) => {
        return container().subprefeitura.listaCompleta();
    }, { recursos: ['subprefeituras'] }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().subprefeitura.buscarPorId(id);
    }, { recursos: ['subprefeituras'] }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateUnidadeDto = await ctx.corpo();
        return container().subprefeitura.atualizar(id, updateUnidadeDto);
    }, { recursos: ['subprefeituras'] }),
]);
