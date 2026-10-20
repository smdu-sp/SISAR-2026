import jwt from 'jsonwebtoken';
import { UnauthorizedException } from './errors';

export interface UsuarioPayload {
	sub: string;
	login: string;
	email: string;
	nome: string;
	permissao: string;
	status: number;
	iat?: number;
	exp?: number;
}

/** Equivale ao ExtractJwt.fromAuthHeaderAsBearerToken do passport-jwt. */
export function tokenBearer(req: Request): string | null {
	const cabecalho = req.headers.get('authorization');
	if (!cabecalho) return null;
	const [esquema, token] = cabecalho.split(' ');
	return esquema?.toLowerCase() === 'bearer' && token ? token : null;
}

export function verificarToken(token: string | null | undefined, segredo: string | undefined): UsuarioPayload {
	if (!token || !segredo) throw new UnauthorizedException();
	try {
		return jwt.verify(token, segredo) as UsuarioPayload;
	} catch {
		throw new UnauthorizedException();
	}
}

export function assinarToken(payload: object, segredo: string | undefined, expiraEm: string) {
	if (!segredo) throw new Error('Segredo JWT não configurado.');
	return jwt.sign(payload, segredo, { expiresIn: expiraEm as jwt.SignOptions['expiresIn'] });
}
