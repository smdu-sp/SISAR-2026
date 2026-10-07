import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissao, Usuario } from '@prisma/client';
import { AcessoLogado, Recurso } from 'src/auth/decorators/recurso.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { DefinirPermissoesDto } from './dto/definir-permissoes.dto';
import { PermissoesService } from './permissoes.service';
import { RECURSO_TRAVADO } from './recursos';

@ApiTags('Permissões')
@ApiBearerAuth()
// O projeto não tem ValidationPipe global; aqui os DTOs precisam ser validados.
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('permissoes')
export class PermissoesController {
  constructor(private readonly service: PermissoesService) {}

  @Get('meus-recursos')
  @AcessoLogado()
  @ApiOperation({ summary: 'Recursos que o perfil do usuário logado pode acessar.' })
  async meusRecursos(@UsuarioAtual() usuario: Usuario) {
    return { recursos: await this.service.recursosDoPerfil(usuario.permissao) };
  }

  @Get()
  @Recurso(RECURSO_TRAVADO)
  @ApiOperation({ summary: 'Catálogo de recursos e matriz perfil x recurso.' })
  matriz() {
    return this.service.matriz();
  }

  @Put(':perfil')
  @Recurso(RECURSO_TRAVADO)
  @ApiOperation({ summary: 'Define os recursos de um perfil.' })
  definir(
    @Param('perfil', new ParseEnumPipe(Permissao)) perfil: Permissao,
    @Body() dto: DefinirPermissoesDto,
  ) {
    return this.service.definir(perfil, dto.recursos);
  }

  @Post('restaurar-padrao')
  @HttpCode(HttpStatus.OK)
  @Recurso(RECURSO_TRAVADO)
  @ApiOperation({ summary: 'Restaura o padrão de todos os perfis.' })
  restaurarPadrao() {
    return this.service.restaurarPadrao();
  }
}
