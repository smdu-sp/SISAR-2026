import { PrismaClient } from '@prisma/client';
/** Mesmo papel do antigo PrismaService do Nest (também usado como token nos testes). */
export class PrismaService extends PrismaClient {
}
/** Uma única conexão por processo (também em desenvolvimento, com recarga a quente). */
const globalComPrisma = globalThis;
export const prisma = globalComPrisma.__prisma ?? new PrismaService();
if (process.env.NODE_ENV !== 'production')
    globalComPrisma.__prisma = prisma;
