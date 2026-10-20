"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const role_guard_1 = require("./auth/guards/role.guard");
const prisma_module_1 = require("./prisma/prisma.module");
const sgu_module_1 = require("./sgu/sgu.module");
const alvara_tipo_module_1 = require("./alvara-tipo/alvara-tipo.module");
const inicial_module_1 = require("./inicial/inicial.module");
const unidades_module_1 = require("./unidades/unidades.module");
const subprefeitura_module_1 = require("./subprefeitura/subprefeitura.module");
const reunioes_module_1 = require("./reunioes/reunioes.module");
const admissibilidade_module_1 = require("./admissibilidade/admissibilidade.module");
const distribuicao_module_1 = require("./distribuicao/distribuicao.module");
const avisos_module_1 = require("./avisos/avisos.module");
const parecer_admissibilidade_module_1 = require("./parecer_admissibilidade/parecer_admissibilidade.module");
const finalizacao_module_1 = require("./finalizacao/finalizacao.module");
const relatorio_module_1 = require("./relatorio/relatorio.module");
const categoria_module_1 = require("./categoria/categoria.module");
const motivo_inadmissao_module_1 = require("./motivo-inadmissao/motivo-inadmissao.module");
const pedido_module_1 = require("./pedido/pedido.module");
const analise_module_1 = require("./analise/analise.module");
const reconsideracao_module_1 = require("./reconsideracao/reconsideracao.module");
const publicacoes_module_1 = require("./publicacoes/publicacoes.module");
const permissoes_module_1 = require("./permissoes/permissoes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [usuarios_module_1.UsuariosModule, auth_module_1.AuthModule, prisma_module_1.PrismaModule, sgu_module_1.SGUModule, alvara_tipo_module_1.AlvaraTipoModule, inicial_module_1.InicialModule, unidades_module_1.UnidadesModule, subprefeitura_module_1.SubprefeituraModule, reunioes_module_1.ReunioesModule, admissibilidade_module_1.AdmissibilidadeModule, distribuicao_module_1.DistribuicaoModule, avisos_module_1.AvisosModule, parecer_admissibilidade_module_1.ParecerAdmissibilidadeModule, relatorio_module_1.RelatorioModule, finalizacao_module_1.FinalizacaoModule, categoria_module_1.CategoriaModule, motivo_inadmissao_module_1.MotivoInadmissaoModule, pedido_module_1.PedidoModule, analise_module_1.AnaliseModule, reconsideracao_module_1.ReconsideracaoModule, publicacoes_module_1.PublicacoesModule, permissoes_module_1.PermissoesModule],
        controllers: [],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_guard_1.RoleGuard,
            },
        ],
        exports: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map