import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('avisos'). */
export const rotasAvisos = controller('avisos', [
    // create
    rota.post('criar', async (ctx) => {
        const createAvisoDto = await ctx.corpo();
        const usuario = ctx.usuario;
        return container().avisos.create(createAvisoDto, createAvisoDto.tipo === 1 ? usuario.id : null);
    }, { status: 201 }),
    // findOne
    rota.get('buscar/:data', (ctx) => {
        const data = ctx.params['data'];
        const usuario = ctx.usuario;
        return container().avisos.findOne(data, usuario.id);
    }, { status: 200 }),
    // buscarPorMesAno
    rota.get('buscar/:mes/:ano', (ctx) => {
        const mes = ctx.params['mes'];
        const ano = ctx.params['ano'];
        const usuario = ctx.usuario;
        return container().avisos.buscarPorMesAno(parseInt(mes), parseInt(ano), usuario.id);
    }, { status: 200 }),
    // update
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateAvisoDto = await ctx.corpo();
        return container().avisos.update(id, updateAvisoDto);
    }, { status: 200 }),
    // remove
    rota.delete('excluir/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().avisos.remove(id);
    }, { status: 200 }),
]);
