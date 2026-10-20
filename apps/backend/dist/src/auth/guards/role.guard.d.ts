import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissoesService } from 'src/permissoes/permissoes.service';
export declare class RoleGuard implements CanActivate {
    private reflector;
    private readonly permissoesService;
    constructor(reflector: Reflector, permissoesService: PermissoesService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
