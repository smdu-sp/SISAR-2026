/** @format */

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const hankenGrotesk = localFont({
	src: './fonts/hanken-grotesk-variable.woff2',
	weight: '400 800',
	variable: '--font-hanken',
	display: 'swap',
});

const ibmPlexMono = localFont({
	src: [
		{ path: './fonts/ibm-plex-mono-400.woff2', weight: '400' },
		{ path: './fonts/ibm-plex-mono-500.woff2', weight: '500' },
		{ path: './fonts/ibm-plex-mono-600.woff2', weight: '600' },
	],
	variable: '--font-ibm-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'SISAR',
	description: 'SISAR',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='pt-BR'
			suppressHydrationWarning
			className={`${hankenGrotesk.variable} ${ibmPlexMono.variable} antialiased`}>
			<head>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon-16x16.png'
				/>
				<link
					rel='mask-icon'
					href='/safari-pinned-tab.svg'
					color='#5bbad5'
				/>
				<meta
					name='msapplication-TileColor'
					content='#eeeeee'
				/>
				<meta
					name='theme-color'
					content='#eeeeee'
				/>
			</head>
			<body>
				<AuthProvider>
					<QueryProvider>
						<ThemeProvider
							attribute='class'
							defaultTheme='system'
							enableSystem
							disableTransitionOnChange>
							{children}
							<Toaster richColors />
						</ThemeProvider>
					</QueryProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
