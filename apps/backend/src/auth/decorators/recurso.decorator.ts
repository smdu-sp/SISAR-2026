import { SetMetadata } from '@nestjs/common';

export const RECURSOS_KEY = 'recursos';

/** Qualquer usuário autenticado acessa (ex.: dados do próprio usuário). */
export const QUALQUER_LOGADO = '*';

/**
 * Exige que o perfil do usuário tenha ao menos um dos recursos informados
 * (configurados na tela de permissões). Endpoints sem este decorator exigem
 * o recurso "processos". Para endpoints públicos use @IsPublic().
 */
export const Recurso = (...chaves: string[]) => SetMetadata(RECURSOS_KEY, chaves);

/** Libera o endpoint para qualquer usuário autenticado. */
export const AcessoLogado = () => SetMetadata(RECURSOS_KEY, [QUALQUER_LOGADO]);
