export {
    buscarTudo,
    buscarPorId,
    buscarNovo,
    listaCompleta,
    validaUsuario,
    listaTecnicos,
    buscarAdministrativos,
    buscarFuncionarios,
} from './query-functions';
export type { IFuncionarios } from './query-functions';

export {
    atualizar,
    criar,
    desativar,
    autorizar,
    adicionarFerias,
    adicionarSubstituto,
    removerSubstituto,
} from './server-functions';