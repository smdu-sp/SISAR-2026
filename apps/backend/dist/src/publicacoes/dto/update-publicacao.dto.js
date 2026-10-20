"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePublicacaoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_publicacao_dto_1 = require("./create-publicacao.dto");
class UpdatePublicacaoDto extends (0, swagger_1.PartialType)(create_publicacao_dto_1.CreatePublicacaoDto) {
}
exports.UpdatePublicacaoDto = UpdatePublicacaoDto;
//# sourceMappingURL=update-publicacao.dto.js.map