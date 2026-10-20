"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const statusIniciais = await prisma.$queryRaw `SELECT status, COUNT(*) as qtd FROM iniciais GROUP BY status ORDER BY status`;
    const statusAdm = await prisma.$queryRaw `SELECT status, COUNT(*) as qtd FROM admissibilidades GROUP BY status ORDER BY status`;
    const sample = await prisma.inicial.findFirst({
        where: { processo_fisico: { contains: '20180351891' } },
        include: {
            admissibilidade: true,
            distribuicao: { include: { tecnico_responsavel: true } },
            conclusao: true,
        },
    });
    console.log('Status iniciais:', statusIniciais);
    console.log('Status admissibilidade:', statusAdm);
    console.log('Amostra:', sample);
}
main()
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=validar-importacao.js.map