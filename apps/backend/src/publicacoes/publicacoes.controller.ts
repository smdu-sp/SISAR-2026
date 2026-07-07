import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { PublicacoesService } from './publicacoes.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';

@ApiTags('Publicações')
@ApiBearerAuth()
@Controller('publicacoes')
export class PublicacoesController {
  constructor(private readonly service: PublicacoesService) {}

  @Permissoes('SUP', 'ADM')
  @Post('criar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar publicação' })
  criar(@Body() dto: CreatePublicacaoDto) {
    return this.service.criar(dto);
  }

  @Get('buscar-tudo')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limite', required: false })
  @ApiQuery({ name: 'busca', required: false })
  @ApiQuery({ name: 'tipo_documento', required: false })
  @ApiQuery({ name: 'colegiado', required: false })
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
    @Query('tipo_documento') tipo_documento?: string,
    @Query('colegiado') colegiado?: string,
  ) {
    return this.service.buscarTudo(
      +pagina,
      +limite,
      busca,
      tipo_documento,
      colegiado,
    );
  }

  @Get('buscar-por-id/:id')
  @HttpCode(HttpStatus.OK)
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Permissoes('SUP', 'ADM')
  @Patch('atualizar/:id')
  @HttpCode(HttpStatus.OK)
  atualizar(@Param('id') id: string, @Body() dto: UpdatePublicacaoDto) {
    return this.service.atualizar(id, dto);
  }
}
