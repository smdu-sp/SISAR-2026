"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubprefeituraDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_subprefeitura_dto_1 = require("./create-subprefeitura.dto");
class UpdateSubprefeituraDto extends (0, mapped_types_1.PartialType)(create_subprefeitura_dto_1.CreateSubprefeituraDto) {
}
exports.UpdateSubprefeituraDto = UpdateSubprefeituraDto;
//# sourceMappingURL=update-subprefeitura.dto.js.map