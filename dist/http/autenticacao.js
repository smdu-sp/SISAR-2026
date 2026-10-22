import jwt from 'jsonwebtoken';
import { UnauthorizedException } from './errors';
/** Equivale ao ExtractJwt.fromAuthHeaderAsBearerToken do passport-jwt. */
export function tokenBearer(req) {
    const cabecalho = req.headers.get('authorization');
    if (!cabecalho)
        return null;
    const [esquema, token] = cabecalho.split(' ');
    return esquema?.toLowerCase() === 'bearer' && token ? token : null;
}
export function verificarToken(token, segredo) {
    if (!token || !segredo)
        throw new UnauthorizedException();
    try {
        return jwt.verify(token, segredo);
    }
    catch {
        throw new UnauthorizedException();
    }
}
export function assinarToken(payload, segredo, expiraEm) {
    if (!segredo)
        throw new Error('Segredo JWT não configurado.');
    return jwt.sign(payload, segredo, { expiresIn: expiraEm });
}
