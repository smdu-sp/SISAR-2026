import { PrismaClient } from '@prisma/sgu/client';

export class SGUService extends PrismaClient {
  constructor() {
    super();
  }
}
