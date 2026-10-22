import { container } from '../container';
import { controller, rota } from '../http/roteador';
import { BadRequestException, ForbiddenException } from '../http/errors';
/** Antigo controller @Controller('inicial'). */
export const rotasInicial = controller('inicial', [
    // criar
    rota.post('criar', async (ctx) => {
        const createInicialDto = await ctx.corpo();
        return container().inicial.criar(createInicialDto);
    }, { status: 201 }),
    // importar
    rota.post('importar', async (ctx) => {
        // Antes: @UseInterceptors(FileInterceptor('arquivo')) + @UploadedFile (multipart, campo "arquivo").
        let arquivo;
        if ((ctx.req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
            const form = await ctx.formData();
            const arquivos = [...form.entries()].filter(([, v]) => typeof v !== 'string');
            // como o multer (FileInterceptor('arquivo')): outro campo de arquivo ou mais de um arquivo -> 400
            if (arquivos.some(([nome]) => nome !== 'arquivo') || arquivos.length > 1) {
                throw new BadRequestException('Unexpected field');
            }
            const campo = arquivos[0]?.[1];
            if (campo)
                arquivo = { buffer: Buffer.from(await campo.arrayBuffer()) };
        }
        if (!arquivo)
            throw new ForbiddenException('Nenhum arquivo enviado.');
        return container().inicial.importarPlanilha(arquivo.buffer);
    }, { recursos: ['importar'], status: 200 }),
    // buscarTudo
    rota.get('buscar-tudo', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        const busca = ctx.query('busca');
        const status = ctx.query('status');
        return container().inicial.buscarTudo(+pagina, +limite, busca, +status);
    }, { recursos: ['painel_inicial', 'processos'], status: 200 }),
    // buscarTudoEmAnalise
    rota.get('buscar-tudo-analise', (ctx) => {
        const pagina = ctx.query('pagina');
        const limite = ctx.query('limite');
        return container().inicial.buscarTudoEmAnalise(+pagina, +limite);
    }, { status: 200 }),
    // buscarPorMesAnoProcesso
    rota.get('buscar/:mes/:ano', (ctx) => {
        const mes = ctx.params['mes'];
        const ano = ctx.params['ano'];
        return container().inicial.buscarPorMesAnoProcesso(parseInt(mes), parseInt(ano));
    }, { status: 200 }),
    // buscarPorId
    rota.get('buscar-por-id/:id', (ctx) => {
        const id = ctx.params['id'];
        return container().inicial.buscarPorId(+id);
    }, { status: 200 }),
    // buscarPorDataProcesso
    rota.get('buscar-data-processo/:date', (ctx) => {
        const data = ctx.params['date'];
        return container().inicial.buscarPorDataProcesso(data);
    }, { status: 200 }),
    // atualizar
    rota.patch('atualizar/:id', async (ctx) => {
        const id = ctx.params['id'];
        const updateInicialDto = await ctx.corpo();
        return container().inicial.atualizar(+id, updateInicialDto);
    }, { status: 200 }),
    // adicionaSql
    rota.patch('adiciona-sql/:inicial_id', async (ctx) => {
        const inicial_id = ctx.params['inicial_id'];
        const { sql } = await ctx.corpo();
        return container().inicial.adicionaSql(+inicial_id, sql);
    }, { status: 200 }),
    // removeSql
    rota.delete('remove-sql/:inicial_id/:sql', (ctx) => {
        const inicial_id = ctx.params['inicial_id'];
        const sql = ctx.params['sql'];
        return container().inicial.removeSql(+inicial_id, sql);
    }, { status: 200 }),
    // validaSql
    rota.get('valida-sql/:sql', (ctx) => {
        const sql = ctx.params['sql'];
        return container().inicial.validaSql(sql);
    }, { status: 200 }),
    // verificaSei
    rota.get('verifica-sei/:sei', (ctx) => {
        const sei = ctx.params['sei'];
        return container().inicial.verificaSei(sei);
    }, { status: 200 }),
    // todosProcessos
    rota.get('busca-processos', (ctx) => {
        return container().inicial.todosProcessos();
    }, { status: 200 }),
]);
