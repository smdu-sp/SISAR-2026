import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('admissibilidade'). */
export const rotasAdmissibilidade = controller('admissibilidade', [
    // create
    rota.post('criar', async (ctx) => {
        const createAdmissibilidadeDto = await ctx.corpo();
        return container().admissibilidade.create(createAdmissibilidadeDto);
    }, { status: 201 }),
    // findAll
    rota.get('consulta', (ctx) => {
        return container().admissibilidade.findAll();
    }, { status: 200 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const filtro = ctx.query('filtro');
        const busca = ctx.query('busca');
        return container().admissibilidade.buscarTudo(+pagina, +limite, +filtro, busca);
    }, { status: 200 }),
    // buscarPorId
    rota.get('buscar-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().admissibilidade.buscarPorId(+id);
    }, { status: 200 }),
    // listaCompleta
    rota.get('lista', (ctx) => {
        return container().admissibilidade.listaCompleta();
    }, { recursos: ['admissibilidade_decidir'], status: 200 }),
    // atulaizarStatus
    rota.patch('atualizar-id/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateAdmissibilidadeDto = await ctx.corpo();
        return container().admissibilidade.atualizarStatus(+id, updateAdmissibilidadeDto);
    }, { status: 200 }),
    // admitir
    rota.post('admitir/:inicialId', async (ctx) => {
        const inicialId = ctx.params['inicialId'];
        const dto = await ctx.corpo();
        return container().admissibilidade.admitir(+inicialId, dto);
    }, { recursos: ['admissibilidade_decidir'], status: 200 }),
    // inadmitir
    rota.post('inadmitir/:inicialId', async (ctx) => {
        const inicialId = ctx.params['inicialId'];
        const dto = await ctx.corpo();
        return container().admissibilidade.inadmitir(+inicialId, dto);
    }, { recursos: ['admissibilidade_decidir'], status: 200 }),
    // remove
    rota.delete(':id', (ctx) => {
        const id = ctx.params['id'];
        return container().admissibilidade.remove(+id);
    }, { status: 200 }),
    // verificaReconsideracao
    rota.get('verifica-reconsideracao', (ctx) => {
        return container().admissibilidade.verificaReconsideracao();
    }, { recursos: ['admissibilidade_decidir'] }),
    // contarRegistros
    rota.get('contar-fora-prazo', async (ctx) => {
        return container().admissibilidade.contarForaDoPrazo();
    }, { recursos: ['dashboard_admissibilidade'] }),
    // contarDentroPrazo
    rota.get('contar-dentro-prazo', async (ctx) => {
        return container().admissibilidade.contarDentroDoPrazo();
    }, { recursos: ['dashboard_admissibilidade'] }),
    // admissibilidadeFinalizada
    rota.get('admissibilidade-finalizada', async (ctx) => {
        return container().admissibilidade.admissibilidadeFinalizada();
    }, { recursos: ['dashboard_admissibilidade'] }),
    // medianaAdmissibilidade
    rota.get('mediana-admissibilidade', async (ctx) => {
        return container().admissibilidade.medianaTempoAdmissibilidade();
    }, { recursos: ['dashboard_admissibilidade'] }),
    // registrosAdmibilidade
    rota.get('registros-admissibilidade', async (ctx) => {
        return container().admissibilidade.registrosAdmissibilidadeFinalizada();
    }, { recursos: ['dashboard_admissibilidade'] }),
]);
