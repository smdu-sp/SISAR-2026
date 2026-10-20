"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResendClient = createResendClient;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
function createResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new common_1.InternalServerErrorException('RESEND_API_KEY nao configurada.');
    }
    return new resend_1.Resend(apiKey);
}
//# sourceMappingURL=resend-client.js.map