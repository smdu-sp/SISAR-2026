import { PartialType } from '@nestjs/swagger';
import { CreateRelatorioAgendamentoDto } from './create-relatorio-agendamento.dto';

export class UpdateRelatorioAgendamentoDto extends PartialType(CreateRelatorioAgendamentoDto) {}
