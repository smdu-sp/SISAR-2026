/** @format */

import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
