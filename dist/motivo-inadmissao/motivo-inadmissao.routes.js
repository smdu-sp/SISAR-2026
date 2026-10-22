import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('motivos-inadmissao'). */
export const rotasMotivoInadmissao = controller('motivos-inadmissao', [
    // criar
    rota.post('criar', async (ctx) => {
        const dto = await ctx.corpo();
        return container().motivoInadmissao.criar(dto);
    }, { recursos: ['motivos_inadmissao'], status: 201 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        return container().motivoInadmissao.buscarTudo(+pagina, +limite, busca);
    }, { status: 200 }),
    // listaCompleta
    rota.get('lista-completa', (ctx) => {
        return container().motivoInadmissao.listaCompleta();
    }, { status: 200 }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().motivoInadmissao.buscarPorId(id);
    }, { status: 200 }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const dto = await ctx.corpo();
        return container().motivoInadmissao.atualizar(id, dto);
    }, { recursos: ['motivos_inadmissao'], status: 200 }),
    // remover
    rota.delete('remover/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().motivoInadmissao.remover(id);
    }, { recursos: ['motivos_inadmissao'], status: 200 }),
]);
