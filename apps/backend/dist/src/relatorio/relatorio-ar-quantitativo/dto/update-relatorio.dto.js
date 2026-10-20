"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRelatorioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_relatorio_dto_1 = require("./create-relatorio.dto");
class UpdateRelatorioDto extends (0, swagger_1.PartialType)(create_relatorio_dto_1.CreateRelatorioDto) {
}
exports.UpdateRelatorioDto = UpdateRelatorioDto;
//# sourceMappingURL=update-relatorio.dto.js.map