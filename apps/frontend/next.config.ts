/** @format */

import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// Permite builds/servidores paralelos (ex.: testes) sem disputar a pasta .next.
	distDir: process.env.NEXT_DIST_DIR || '.next',
	// Bibliotecas do servidor (API) que não devem ser empacotadas.
	serverExternalPackages: ['@prisma/client', 'ldapjs', 'exceljs', 'pdfmake', 'resend'],
	outputFileTracingRoot: path.join(__dirname, '../../'),
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	allowedDevOrigins: [
		'10.20.4.6',
		'127.0.0.1'
	],
};

export default nextConfig;
