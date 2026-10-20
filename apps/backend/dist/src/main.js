"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3000;
    app.enableCors({ origin: ['http://localhost:3001', 'http://localhost:3030'] });
    const options = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('SISAR')
        .setDescription('Backend em NestJS para aplicação de controle de processos Aprova Rápido.')
        .setVersion('versão 1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(port);
    console.log("API Aprova Rápido rodando em http://localhost:" + port);
    console.log("SwaggerUI rodando em http://localhost:" + port + "/api");
}
bootstrap();
//# sourceMappingURL=main.js.map