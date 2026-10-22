import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('alvara-tipo'). */
export const rotasAlvaraTipo = controller('alvara-tipo', [
    // criar
    rota.post('criar', async (ctx) => {
        const createAlvaraTipoDto = await ctx.corpo();
        return container().alvaraTipo.criar(createAlvaraTipoDto);
    }, { recursos: ['alvaras'], status: 201 }),
    // listaCompleta
    rota.get('lista-completa', (ctx) => {
        return container().alvaraTipo.listaCompleta();
    }, { status: 200 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        return container().alvaraTipo.buscarTudo(+pagina, +limite, busca);
    }, { recursos: ['alvaras'], status: 200 }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().alvaraTipo.buscarPorId(id);
    }, { recursos: ['alvaras'], status: 200 }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateAlvaraTipoDto = await ctx.corpo();
        return container().alvaraTipo.atualizar(id, updateAlvaraTipoDto);
    }, { recursos: ['alvaras'], status: 200 }),
    // auterarStatus
    rota.patch('auterar-status/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateAlvaraTipoDto = await ctx.corpo();
        return container().alvaraTipo.atualizar(id, updateAlvaraTipoDto);
    }, { recursos: ['alvaras'], status: 200 }),
]);
