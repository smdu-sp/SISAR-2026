import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RelatorioResopnseDto } from './relatorio-ar-quantitativo/dto/response-relatorio.dto';
import { RelatorioService } from './relatorio-ar-quantitativo/relatorio-ar.service';
import { RelatorioRRService } from './relatorio-rr-quantitativo/relatorio-rr.service';
import { ArGraficoProgressaoMensalService } from './ar-grafico-progressao-mensal/ar-grafico-progressao-mensal.service';
import { RelatorioComplementarService } from './relatorio-complementar/relatorio-complementar.service';
import { RelatorioExportacaoService } from './exportacao/relatorio-exportacao.service';
import { EnviarRelatorioEmailDto } from './dto/enviar-relatorio-email.dto';
import { RelatorioEmailService } from './email/relatorio-email.service';

@Controller('relatorio')
@ApiTags('Relatórios')
export class RelatorioController {
  constructor(
    private readonly relatorioService: RelatorioService,
    private readonly relatorioRRService: RelatorioRRService,
    private readonly arGraficoProgressaoMensal: ArGraficoProgressaoMensalService,
    private readonly relatorioComplementarService: RelatorioComplementarService,
    private readonly relatorioExportacaoService: RelatorioExportacaoService,
    private readonly relatorioEmailService: RelatorioEmailService,
  ) { }

  @IsPublic()
  @Get("ar/quantitativo/:mes?/:ano?")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna 200 se buscar o relatório Aprova Rápido com sucesso.', type: RelatorioResopnseDto })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Buscar o relatório Aprova Rápido.", summary: 'Busque relatório Aprova Rápido.' })
  async relatorioQuantitativo(@Param('mes') mes: string, @Param('ano') ano: string) {
    return await this.relatorioService.getRelatorio(mes, ano);
  }

  @IsPublic()
  @Get("rr/quantitativo/:mes/:ano")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna 200 se buscar o relatório Requalifica Rápido com sucesso.', type: RelatorioResopnseDto })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Buscar o relatório Requalifica Rápido.", summary: 'Busque relatório Requalifica Rápido.' })
  async relatorioRequalificaRapido(@Param('mes') mes: string, @Param('ano') ano: string) {
    return await this.relatorioRRService.getRelatorio(mes, ano);
  }

  @IsPublic()
  @Get('ar/progressao-mensal/:anoInicial/:anoFinal')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'anoInicial', type: 'string', example: '2024', required: true })
  @ApiParam({ name: 'anoFinal', type: 'string', example: '2026', required: true })
  @ApiOperation({
    description: 'Buscar o relatório Aprova Rápido - Gráfico de Progressão Mensal por intervalo de anos.',
    summary: 'Relatório AR - Progressão mensal por intervalo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna a progressão mensal agrupada por ano.',
    schema: {
      example: [
        {
          ano: 2026,
          mes: [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          acc: [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se o intervalo de anos for inválido.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async relatorioArGraficoProgressaoMensalIntervalo(
    @Param('anoInicial') anoInicial: string,
    @Param('anoFinal') anoFinal: string,
  ) {
    return await this.arGraficoProgressaoMensal.getByYearRange(
      Number(anoInicial),
      Number(anoFinal),
    );
  }

  @IsPublic()
  @Get('ar/progressao-mensal/:ano')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'ano', type: 'string', example: '2026', required: true })
  @ApiOperation({
    description: 'Buscar o relatório Aprova Rápido - Gráfico de Progressão Mensal para um ano.',
    summary: 'Relatório AR - Progressão mensal por ano.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna a progressão mensal do ano informado.',
    schema: {
      example: [
        {
          ano: 2026,
          mes: [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          acc: [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se o ano for inválido.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async relatorioArGraficoProgressaoMensal(@Param('ano') ano: string) {
    return await this.arGraficoProgressaoMensal.getAllByYear(Number(ano));
  }

  @IsPublic()
  @Get('ar/prazo-analise-admissibilidade/:dataInicial/:dataFinal')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'dataInicial', type: 'string', example: '01-01-2026', required: true })
  @ApiParam({ name: 'dataFinal', type: 'string', example: '31-12-2026', required: true })
  @ApiOperation({
    description: 'Buscar o relatório Aprova Rápido - Análise de Admissibilidade no período informado.',
    summary: 'Relatório AR - Prazo de análise de admissibilidade.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna cabeçalho e dados agrupados por ano e mês.',
    schema: {
      example: {
        cabecalho: {
          prazoFixoAnalise: '15 dias',
          dataInicio: '01/01/2026',
          dataFim: '31/12/2026',
          qtdAnaliseFinalizada: '1',
          qtdAnaliseNoPrazo: '1',
          qtdAnaliseExcedido: '0',
          mediaPeriodoAnalise: '10.0 dias',
          mediaPeriodoReconsideracao: '0 dias',
        },
        dados: {
          '2026': {
            'jan.': [
              {
                id: 1,
                sei: '123456789',
                ano: 2026,
                mes: 'jan.',
                tempo_de_analise_admissibilidade: 10,
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se o período for inválido.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async relatorioArPrazoAnaliseAdmissibilidade(
    @Param('dataInicial') dataInicial: string,
    @Param('dataFinal') dataFinal: string,
  ) {
    return await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeAR(
      dataInicial,
      dataFinal,
    );
  }

  @IsPublic()
  @Get('rr/prazo-analise-admissibilidade/:dataInicial/:dataFinal')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'dataInicial', type: 'string', example: '01-01-2026', required: true })
  @ApiParam({ name: 'dataFinal', type: 'string', example: '31-12-2026', required: true })
  @ApiOperation({
    description: 'Buscar o relatório Requalifica Rápido - Análise de Admissibilidade no período informado.',
    summary: 'Relatório RR - Prazo de análise de admissibilidade.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna cabeçalho e lista de processos do período.',
    schema: {
      example: {
        cabecalho: {
          prazoFixoAnalise: '15 dias',
          dataInicio: '01/01/2026',
          dataFim: '31/12/2026',
          qtdAnaliseFinalizada: '1',
          qtdAnaliseNoPrazo: '1',
          qtdAnaliseExcedido: '0',
          mediaPeriodoAnalise: '10.0 dias',
          mediaPeriodoReconsideracao: '0 dias',
        },
        dados: [
          {
            id: 1,
            sei: '123456789',
            ano: 2026,
            mes: 'jan.',
            tempo_de_analise_admissibilidade: 10,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se o período for inválido.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async relatorioRrPrazoAnaliseAdmissibilidade(
    @Param('dataInicial') dataInicial: string,
    @Param('dataFinal') dataFinal: string,
  ) {
    return await this.relatorioComplementarService.getPrazoAnaliseAdmissibilidadeRR(
      dataInicial,
      dataFinal,
    );
  }

  @IsPublic()
  @Get('ar/gabinete-do-prefeito')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Buscar o relatório Aprova Rápido - Controle Gabinete do Prefeito.',
    summary: 'Relatório AR - Gabinete do Prefeito.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna processos protocolados e aprovados agrupados por ano e mês.',
    schema: {
      example: [
        {
          ano: 2026,
          dados: [],
          'jan.': [
            {
              id: 1,
              sei: '123456789',
              numero_do_processo: '123456789',
              tempo_de_analise_pedido_inicial: 10,
              tempo_de_analise_recurso: null,
            },
          ],
          'fev.': [],
          'mar.': [],
          'abr.': [],
          'mai.': [],
          'jun.': [],
          'jul.': [],
          'ago.': [],
          'set.': [],
          'out.': [],
          'nov.': [],
          'dez.': [],
          numeros_de_processos: [],
          processos_protocolados: 1,
          processos_aprovados: 0,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async relatorioArGabinetePrefeito() {
    return await this.relatorioComplementarService.getGabinetePrefeito();
  }

  @IsPublic()
  @Get('exportar/:tipoRelatorio/:formato')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tipoRelatorio',
    type: 'string',
    enum: [
      'ar-quantitativo',
      'rr-quantitativo',
      'ar-progressao-mensal',
      'ar-gabinete-prefeito',
      'ar-analise-admissibilidade',
      'rr-analise-admissibilidade',
    ],
    required: true,
  })
  @ApiParam({ name: 'formato', type: 'string', enum: ['excel', 'pdf'], required: true })
  @ApiOperation({
    description:
      'Exporta o relatório informado no formato solicitado. O arquivo é gerado em memória e retornado como download.',
    summary: 'Exportar relatório.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o arquivo gerado para download.',
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se o tipo, formato ou filtros forem inválidos.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  async exportarRelatorio(
    @Param('tipoRelatorio') tipoRelatorio: string,
    @Param('formato') formato: string,
    @Query('dataInicial') dataInicial: string,
    @Query('dataFinal') dataFinal: string,
    @Query('anoInicial') anoInicial: string,
    @Query('anoFinal') anoFinal: string,
    @Query('periodo') periodo: string,
    @Res() res: Response,
  ) {
    const arquivo = await this.relatorioExportacaoService.exportar(
      tipoRelatorio,
      formato,
      {
        dataInicial,
        dataFinal,
        anoInicial,
        anoFinal,
        periodo,
      },
    );

    res.setHeader('Content-Type', arquivo.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${arquivo.filename}"`,
    );
    res.setHeader('Content-Length', arquivo.buffer.length);
    return res.send(arquivo.buffer);
  }

  @IsPublic()
  @Post('enviar-email/:tipoRelatorio/:formato')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'tipoRelatorio',
    type: 'string',
    enum: [
      'ar-quantitativo',
      'rr-quantitativo',
      'ar-progressao-mensal',
      'ar-gabinete-prefeito',
      'ar-analise-admissibilidade',
      'rr-analise-admissibilidade',
    ],
    required: true,
  })
  @ApiParam({ name: 'formato', type: 'string', enum: ['excel', 'pdf'], required: true })
  @ApiBody({ type: EnviarRelatorioEmailDto })
  @ApiOperation({
    description:
      'Gera o relatorio informado em memoria e envia o arquivo como anexo por email usando Resend.',
    summary: 'Enviar relatorio por email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do email enviado e o nome do arquivo anexado.',
    schema: {
      example: {
        id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
        filename: 'ar-quantitativo-2026-07-01.xlsx',
        destinatarios: ['usuario@dominio.gov.br'],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Retorna 400 se dados, formato ou filtros forem invalidos.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se nao autorizado.' })
  async enviarRelatorioPorEmail(
    @Param('tipoRelatorio') tipoRelatorio: string,
    @Param('formato') formato: string,
    @Body() dto: EnviarRelatorioEmailDto,
  ) {
    return this.relatorioEmailService.enviar(tipoRelatorio, formato, dto);
  }
}
