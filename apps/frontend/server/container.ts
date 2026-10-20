/**
 * Container manual de dependências (substitui a injeção do NestJS).
 * Cada módulo migrado registra seu service aqui.
 */
import { prisma } from './config/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const container: any = { prisma };
