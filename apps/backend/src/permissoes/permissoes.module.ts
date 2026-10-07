import { Global, Module } from '@nestjs/common';
import { PermissoesController } from './permissoes.controller';
import { PermissoesService } from './permissoes.service';

@Global()
@Module({
  controllers: [PermissoesController],
  providers: [PermissoesService],
  exports: [PermissoesService],
})
export class PermissoesModule {}
