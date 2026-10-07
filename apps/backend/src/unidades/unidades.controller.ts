import { Recurso } from 'src/auth/decorators/recurso.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnidadeResponseDTO } from './dto/unidade-response.dto';
import { Nivel_Unidade } from '@prisma/client';

@ApiTags('Unidades')
@ApiBearerAuth()
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Recurso('unidades')
  @Post('criar')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ description: 'Corpo da requisição para criação de unidade.', type: CreateUnidadeDto })
  @ApiResponse({ status: 201, description: 'Retorna 201 se criar com sucesso.', type: UnidadeResponseDTO })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Crie uma unidade.", summary: 'Crie unidades.' })
  criar(@Body() createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDTO> {
    return this.unidadesService.criar(createUnidadeDto);
  }

  @Recurso('unidades', 'relatorios')
  @Get('buscar-tudo')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna 200 se buscar com sucesso.', type: [CreateUnidadeDto] })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Busque todas as unidades.", summary: 'Busque todas as unidades.' })
  @ApiQuery({ name: 'pagina', type: 'string', required: false })
  @ApiQuery({ name: 'limite', type: 'string', required: false })
  @ApiQuery({ name: 'filtro', type: 'string', required: false })
  @ApiQuery({ name: 'busca', type: 'string', required: false })
  @ApiQuery({ name: 'nivel', enum: Nivel_Unidade, required: false })
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
    @Query('filtro') filtro?: string,
    @Query('nivel') nivel?: Nivel_Unidade
) {
    return this.unidadesService.buscarTudo(+pagina, +limite, busca, +filtro, nivel);
}

  @Recurso('unidades')
  @Get('arvore')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna a árvore hierárquica de unidades.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Árvore hierárquica de unidades.", summary: 'Árvore de unidades.' })
  @ApiQuery({ name: 'busca', type: 'string', required: false })
  arvore(@Query('busca') busca?: string) {
    return this.unidadesService.arvore(busca);
  }

  @Recurso('unidades')
  @Get('lista-completa')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna 200 se listar tudo com sucesso.', type: [UnidadeResponseDTO] })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Listar todas as unidades.", summary: 'Liste todas as unidades.' })
  @ApiQuery({ name: 'nivel', enum: Nivel_Unidade, required: false })
  listaCompleta(@Query('nivel') nivel?: Nivel_Unidade): Promise<UnidadeResponseDTO[]> {
    return this.unidadesService.listaCompleta(nivel);
  }

  @Recurso('unidades')
  @Get('buscar-por-id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Retorna 200 se buscar por ID com sucesso.', type: UnidadeResponseDTO })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Buscar uma unidade.", summary: 'Busque uma unidade.' })
  buscarPorId(@Param('id') id: string): Promise<UnidadeResponseDTO> {
    return this.unidadesService.buscarPorId(id);
  }

  @Recurso('unidades')
  @Patch('atualizar/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ description: 'Corpo da requisição para atualização de unidade.', type: CreateUnidadeDto })
  @ApiResponse({ status: 200, description: 'Retorna 200 se atualizar com sucesso.', type: UnidadeResponseDTO })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Atualizar uma unidade.", summary: 'Atualize uma unidade.' })
  atualizar(
    @Param('id') id: string, 
    @Body() updateUnidadeDto: UpdateUnidadeDto
  ): Promise<UnidadeResponseDTO> {
    return this.unidadesService.atualizar(id, updateUnidadeDto);
  }

  @Recurso('unidades')
  @Patch('desativar/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ description: 'Corpo da requisição para desativação de unidade.', type: CreateUnidadeDto })
  @ApiResponse({ status: 200, description: 'Retorna 200 se desativar com sucesso.' })
  @ApiResponse({ status: 401, description: 'Retorna 401 se não autorizado.' })
  @ApiOperation({ description: "Desativar uma unidade.", summary: 'Desative uma unidade.' })
  desativar(@Param('id') id: string) {
    return this.unidadesService.desativar(id);
  }
}
