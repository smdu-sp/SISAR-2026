"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcessoLogado = exports.Recurso = exports.QUALQUER_LOGADO = exports.RECURSOS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RECURSOS_KEY = 'recursos';
exports.QUALQUER_LOGADO = '*';
const Recurso = (...chaves) => (0, common_1.SetMetadata)(exports.RECURSOS_KEY, chaves);
exports.Recurso = Recurso;
const AcessoLogado = () => (0, common_1.SetMetadata)(exports.RECURSOS_KEY, [exports.QUALQUER_LOGADO]);
exports.AcessoLogado = AcessoLogado;
//# sourceMappingURL=recurso.decorator.js.map