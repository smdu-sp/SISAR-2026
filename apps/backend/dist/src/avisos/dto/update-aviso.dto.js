"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvisoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_aviso_dto_1 = require("./create-aviso.dto");
class UpdateAvisoDto extends (0, swagger_1.PartialType)(create_aviso_dto_1.CreateAvisoDto) {
}
exports.UpdateAvisoDto = UpdateAvisoDto;
//# sourceMappingURL=update-aviso.dto.js.map