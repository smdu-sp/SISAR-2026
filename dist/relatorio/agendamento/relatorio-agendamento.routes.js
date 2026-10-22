import { container } from '../../container';
import { controller, rota } from '../../http/roteador';
import { validarDto } from '../../http/validar';
import { CreateRelatorioAgendamentoDto } from './dto/create-relatorio-agendamento.dto';
import { UpdateRelatorioAgendamentoDto } from './dto/update-relatorio-agendamento.dto';
// O controller tinha @UsePipes(new ValidationPipe({ whitelist: true, transform: true })).
/** Antigo controller @Controller('relatorio-agendamentos'). */
export const rotasRelatorioAgendamento = controller('relatorio-agendamentos', [
    // listar
    rota.get('', (ctx) => {
        return container().relatorioAgendamento.listar();
    }, { recursos: ['envio_relatorios'] }),
    // statusEmail
    rota.get('status-email', (ctx) => {
        return container().relatorioAgendamento.statusEmail();
    }, { recursos: ['envio_relatorios'] }),
    // buscarPorId
    rota.get(':id', (ctx) => {
        const id = ctx.params['id'];
        return container().relatorioAgendamento.buscarPorId(id);
    }, { recursos: ['envio_relatorios'] }),
    // historico
    rota.get(':id/historico', (ctx) => {
        const id = ctx.params['id'];
        return container().relatorioAgendamento.historico(id);
    }, { recursos: ['envio_relatorios'] }),
    // criar
    rota.post('', async (ctx) => {
        const dto = await validarDto(CreateRelatorioAgendamentoDto, await ctx.corpo());
        const usuario = ctx.usuario;
        return container().relatorioAgendamento.criar(dto, usuario?.id);
    }, { recursos: ['envio_relatorios'] }),
    // atualizar
    rota.patch(':id', async (ctx) => {
        const id = ctx.params['id'];
        const dto = await validarDto(UpdateRelatorioAgendamentoDto, await ctx.corpo());
        return container().relatorioAgendamento.atualizar(id, dto);
    }, { recursos: ['envio_relatorios'] }),
    // executarAgora
    rota.post(':id/executar', (ctx) => {
        const id = ctx.params['id'];
        return container().relatorioAgendamento.executarAgora(id);
    }, { status: 200, recursos: ['envio_relatorios'] }),
    // remover
    rota.delete(':id', (ctx) => {
        const id = ctx.params['id'];
        return container().relatorioAgendamento.remover(id);
    }, { recursos: ['envio_relatorios'] }),
]);
