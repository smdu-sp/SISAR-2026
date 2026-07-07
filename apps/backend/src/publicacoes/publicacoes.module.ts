import { Module } from '@nestjs/common';
import { PublicacoesController } from './publicacoes.controller';
import { PublicacoesService } from './publicacoes.service';

@Module({
  controllers: [PublicacoesController],
  providers: [PublicacoesService],
  exports: [PublicacoesService],
})
export class PublicacoesModule {}
