"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSOES_PADRAO = exports.CHAVES_RECURSOS = exports.RECURSOS = exports.PERFIS = exports.RECURSO_TRAVADO = exports.RECURSO_PADRAO = void 0;
exports.RECURSO_PADRAO = 'processos';
exports.RECURSO_TRAVADO = 'permissoes';
exports.PERFIS = ['DEV', 'SUP', 'ADM', 'USR', 'GAB_ASC'];
exports.RECURSOS = [
    {
        chave: 'painel_inicial',
        rotulo: 'Página inicial',
        grupo: 'Geral',
        descricao: 'Painel com a lista de processos e seus prazos.',
    },
    {
        chave: 'processos',
        rotulo: 'Processos',
        grupo: 'Geral',
        descricao: 'Detalhes, análise, distribuição, finalização, agenda, publicações e demais telas e ações de processos.',
    },
    {
        chave: 'perfil',
        rotulo: 'Meu perfil',
        grupo: 'Geral',
        descricao: 'Tela com os dados do próprio usuário.',
    },
    {
        chave: 'dashboard_admissibilidade',
        rotulo: 'Dashboard de admissibilidade',
        grupo: 'Indicadores',
        descricao: 'Indicadores de prazos e registros de admissibilidade.',
    },
    {
        chave: 'relatorios',
        rotulo: 'Relatórios',
        grupo: 'Indicadores',
        descricao: 'Consulta e exportação (PDF/Excel) dos relatórios.',
    },
    {
        chave: 'admissibilidade_decidir',
        rotulo: 'Admitir e inadmitir processos',
        grupo: 'Ações',
        descricao: 'Registrar a decisão de admissibilidade.',
    },
    {
        chave: 'importar',
        rotulo: 'Importar processos',
        grupo: 'Ações',
        descricao: 'Importação em lote de processos por planilha.',
    },
    {
        chave: 'publicacoes',
        rotulo: 'Gerir publicações',
        grupo: 'Ações',
        descricao: 'Criar e editar publicações.',
    },
    {
        chave: 'reunioes',
        rotulo: 'Gerir reuniões',
        grupo: 'Ações',
        descricao: 'Consultar e remarcar reuniões (agenda).',
    },
    {
        chave: 'usuarios',
        rotulo: 'Usuários',
        grupo: 'Administração',
        descricao: 'Cadastro e autorização de usuários.',
    },
    {
        chave: 'unidades',
        rotulo: 'Unidades',
        grupo: 'Administração',
        descricao: 'Coordenadorias, diretorias e unidades.',
    },
    {
        chave: 'subprefeituras',
        rotulo: 'Subprefeituras',
        grupo: 'Administração',
        descricao: 'Cadastro de subprefeituras.',
    },
    {
        chave: 'alvaras',
        rotulo: 'Prazos por alvará',
        grupo: 'Administração',
        descricao: 'Tipos de alvará e seus prazos.',
    },
    {
        chave: 'pareceres',
        rotulo: 'Pareceres de admissibilidade',
        grupo: 'Administração',
        descricao: 'Cadastro de pareceres.',
    },
    {
        chave: 'categorias',
        rotulo: 'Categorias',
        grupo: 'Administração',
        descricao: 'Cadastro de categorias.',
    },
    {
        chave: 'motivos_inadmissao',
        rotulo: 'Motivos de inadmissão',
        grupo: 'Administração',
        descricao: 'Cadastro de motivos de inadmissão.',
    },
    {
        chave: 'pedidos',
        rotulo: 'Pedidos',
        grupo: 'Administração',
        descricao: 'Cadastro de pedidos.',
    },
    {
        chave: 'envio_relatorios',
        rotulo: 'Envio automático de relatórios',
        grupo: 'Administração',
        descricao: 'Agendar o envio de relatórios por e-mail.',
    },
    {
        chave: exports.RECURSO_TRAVADO,
        rotulo: 'Gestão de permissões',
        grupo: 'Administração',
        descricao: 'Definir o que cada perfil pode acessar. Exclusivo do perfil DEV.',
    },
];
exports.CHAVES_RECURSOS = exports.RECURSOS.map((r) => r.chave);
const administracao = [
    'usuarios',
    'unidades',
    'subprefeituras',
    'alvaras',
    'pareceres',
    'categorias',
    'motivos_inadmissao',
    'pedidos',
];
const operacao = [
    'painel_inicial',
    'processos',
    'perfil',
    'admissibilidade_decidir',
    'importar',
    'publicacoes',
    'reunioes',
];
exports.PERMISSOES_PADRAO = {
    DEV: exports.CHAVES_RECURSOS.filter((c) => c !== exports.RECURSO_TRAVADO),
    ADM: [
        ...operacao,
        ...administracao,
        'dashboard_admissibilidade',
        'relatorios',
    ],
    SUP: [...operacao, ...administracao],
    USR: ['painel_inicial', 'processos', 'perfil'],
    GAB_ASC: [
        'painel_inicial',
        'perfil',
        'dashboard_admissibilidade',
        'relatorios',
    ],
};
//# sourceMappingURL=recursos.js.map