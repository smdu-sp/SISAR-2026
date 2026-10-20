"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma.unidade.findMany({ select: { id: true, sigla: true, nome: true } }).then((r) => {
    console.log(r);
    prisma.$disconnect();
});
//# sourceMappingURL=listar-unidades.js.map