import { PrismaClient } from '@prisma/client';
/** Mesmo papel do antigo PrismaService do Nest (também usado como token nos testes). */
export declare class PrismaService extends PrismaClient {
}
export declare const prisma: PrismaService;
