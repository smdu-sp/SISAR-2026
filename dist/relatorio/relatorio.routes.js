import { container } from '../container';
import { controller, rota } from '../http/roteador';
/** Antigo controller @Controller('relatorio'). */
export const rotasRelatorio = controller('relatorio', [
    // relatorioQuantitativo
    rota.get('ar/quantitativo/:mes?/:ano?', async (ctx) => {
        const mes = ctx.params['mes'];
        const ano = ctx.params['ano'];
        return await container().relatorio.getRelatorio(mes, ano);
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioRequalificaRapido
    rota.get('rr/quantitativo/:mes/:ano', async (ctx) => {
        const mes = ctx.params['mes'];
        const ano = ctx.params['ano'];
        return await container().relatorioRR.getRelatorio(mes, ano);
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioArGraficoProgressaoMensalIntervalo
    rota.get('ar/progressao-mensal/:anoInicial/:anoFinal', async (ctx) => {
        const anoInicial = ctx.params['anoInicial'];
        const anoFinal = ctx.params['anoFinal'];
        return await container().arGraficoProgressaoMensal.getByYearRange(Number(anoInicial), Number(anoFinal));
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioArGraficoProgressaoMensal
    rota.get('ar/progressao-mensal/:ano', async (ctx) => {
        const ano = ctx.params['ano'];
        return await container().arGraficoProgressaoMensal.getAllByYear(Number(ano));
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioArPrazoAnaliseAdmissibilidade
    rota.get('ar/prazo-analise-admissibilidade/:dataInicial/:dataFinal', async (ctx) => {
        const dataInicial = ctx.params['dataInicial'];
        const dataFinal = ctx.params['dataFinal'];
        return await container().relatorioComplementar.getPrazoAnaliseAdmissibilidadeAR(dataInicial, dataFinal);
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioRrPrazoAnaliseAdmissibilidade
    rota.get('rr/prazo-analise-admissibilidade/:dataInicial/:dataFinal', async (ctx) => {
        const dataInicial = ctx.params['dataInicial'];
        const dataFinal = ctx.params['dataFinal'];
        return await container().relatorioComplementar.getPrazoAnaliseAdmissibilidadeRR(dataInicial, dataFinal);
    }, { recursos: ['relatorios'], status: 200 }),
    // relatorioArGabinetePrefeito
    rota.get('ar/gabinete-do-prefeito', async (ctx) => {
        return await container().relatorioComplementar.getGabinetePrefeito();
    }, { recursos: ['relatorios'], status: 200 }),
    // exportarRelatorio
    rota.get('exportar/:tipoRelatorio/:formato', async (ctx) => {
        const tipoRelatorio = ctx.params['tipoRelatorio'];
        const formato = ctx.params['formato'];
        const dataInicial = ctx.query('dataInicial');
        const dataFinal = ctx.query('dataFinal');
        const anoInicial = ctx.query('anoInicial');
        const anoFinal = ctx.query('anoFinal');
        const periodo = ctx.query('periodo');
        const arquivo = await container().relatorioExportacao.exportar(tipoRelatorio, formato, {
            dataInicial,
            dataFinal,
            anoInicial,
            anoFinal,
            periodo,
        });
        // Antes: @Res() do Express com os mesmos cabeçalhos.
        return new Response(new Uint8Array(arquivo.buffer), {
            status: 200,
            headers: {
                'Content-Type': arquivo.contentType,
                'Content-Disposition': `attachment; filename="${arquivo.filename}"`,
                'Content-Length': String(arquivo.buffer.length),
            },
        });
    }, { recursos: ['relatorios'], status: 200 }),
    // enviarRelatorioPorEmail
    rota.post('enviar-email/:tipoRelatorio/:formato', async (ctx) => {
        const tipoRelatorio = ctx.params['tipoRelatorio'];
        const formato = ctx.params['formato'];
        const dto = await ctx.corpo();
        return container().relatorioEmail.enviar(tipoRelatorio, formato, dto);
    }, { recursos: ['envio_relatorios'], status: 200 }),
]);
