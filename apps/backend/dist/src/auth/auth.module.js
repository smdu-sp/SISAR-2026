"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const usuarios_module_1 = require("../usuarios/usuarios.module");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const validar_login_middleware_1 = require("./middlewares/validar-login.middleware");
const rt_strategy_1 = require("./strategies/rt.strategy");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(validar_login_middleware_1.ValidarLoginMiddleware).forRoutes('login');
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, rt_strategy_1.RtStrategy],
        imports: [
            usuarios_module_1.UsuariosModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '1d',
                },
            }),
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map