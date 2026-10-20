"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReunioesDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reunioes_dto_1 = require("./create-reunioes.dto");
class UpdateReunioesDto extends (0, mapped_types_1.PartialType)(create_reunioes_dto_1.CreateReunioesDto) {
}
exports.UpdateReunioesDto = UpdateReunioesDto;
//# sourceMappingURL=update-reunioes.dto.js.map