import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissoesService } from 'src/permissoes/permissoes.service';
import { RECURSO_PADRAO } from 'src/permissoes/recursos';
import {
  QUALQUER_LOGADO,
  RECURSOS_KEY,
} from '../decorators/recurso.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permissoesService: PermissoesService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const usuario = context.switchToHttp().getRequest().user;
    // Rota pública (sem usuário autenticado): nada a verificar.
    if (!usuario) return true;

    const recursos = this.reflector.getAllAndOverride<string[]>(RECURSOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [RECURSO_PADRAO];
    if (recursos.includes(QUALQUER_LOGADO)) return true;

    return this.permissoesService.temAlgum(usuario.permissao, recursos);
  }
}
