import { PrismaClient } from '@prisma/client';

/** Uma única conexão por processo (também em desenvolvimento, com recarga a quente). */
const globalComPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma: PrismaClient = globalComPrisma.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalComPrisma.__prisma = prisma;

export type PrismaService = PrismaClient;
