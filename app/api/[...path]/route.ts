import type { NextRequest } from 'next/server';
import { tratarRequisicao } from '../../../src/api';

// A API roda no runtime Node (Prisma, LDAP, geração de PDF/Excel).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Contexto = { params: Promise<{ path: string[] }> };

async function tratar(req: NextRequest, { params }: Contexto) {
	const { path } = await params;
	return tratarRequisicao(req, path);
}

export const GET = tratar;
export const POST = tratar;
export const PATCH = tratar;
export const PUT = tratar;
export const DELETE = tratar;
