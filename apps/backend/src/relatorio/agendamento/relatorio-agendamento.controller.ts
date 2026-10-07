import { Recurso } from 'src/auth/decorators/recurso.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Usuario } from '@prisma/client';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { RelatorioAgendamentoService } from './relatorio-agendamento.service';
import { CreateRelatorioAgendamentoDto } from './dto/create-relatorio-agendamento.dto';
import { UpdateRelatorioAgendamentoDto } from './dto/update-relatorio-agendamento.dto';

@ApiTags('Relatórios - Envio agendado')
@ApiBearerAuth()
// O projeto não tem ValidationPipe global; aqui os DTOs precisam ser validados.
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('relatorio-agendamentos')
export class RelatorioAgendamentoController {
  constructor(private readonly service: RelatorioAgendamentoService) {}

  @Get()
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Lista os envios agendados de relatórios.' })
  listar() {
    return this.service.listar();
  }

  @Get('status-email')
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Informa se o envio de e-mail está configurado.' })
  statusEmail() {
    return this.service.statusEmail();
  }

  @Get(':id')
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Busca um envio agendado.' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Get(':id/historico')
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Últimas execuções (sucesso ou falha) do envio agendado.' })
  historico(@Param('id') id: string) {
    return this.service.historico(id);
  }

  @Post()
  @Recurso('envio_relatorios')
  @ApiOperation({
    summary: 'Cria um envio agendado.',
    description:
      'Ex.: todo dia 5 do mês, 08:00, relatório X em PDF e Excel para os e-mails informados.',
  })
  criar(@Body() dto: CreateRelatorioAgendamentoDto, @UsuarioAtual() usuario: Usuario) {
    return this.service.criar(dto, usuario?.id);
  }

  @Patch(':id')
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Atualiza um envio agendado (inclusive ativar/desativar).' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateRelatorioAgendamentoDto) {
    return this.service.atualizar(id, dto);
  }

  @Post(':id/executar')
  @HttpCode(HttpStatus.OK)
  @Recurso('envio_relatorios')
  @ApiOperation({
    summary: 'Dispara o envio agora, sem alterar a programação.',
  })
  executarAgora(@Param('id') id: string) {
    return this.service.executarAgora(id);
  }

  @Delete(':id')
  @Recurso('envio_relatorios')
  @ApiOperation({ summary: 'Remove um envio agendado e seu histórico.' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
