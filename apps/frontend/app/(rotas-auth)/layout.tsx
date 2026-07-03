/** @format */

import Breadcrumbs from '@/components/breadcrumbs';
import { DrawerMenu } from '@/components/drawer-menu';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ModeToggle } from '@/components/toggle-theme';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function RotasAuth({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session) redirect('/login');
	return (
		<div className='relative w-full bg-background'>
			<ModeToggle className='absolute top-4 right-4 z-50 sm:hidden' />
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className='h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 hidden sm:flex sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md backdrop-saturate-[1.4]'>
						<div className='flex items-center gap-2 px-4 flex-1'>
							<SidebarTrigger className='-ml-1 md:hidden' />
							<Separator
								orientation='vertical'
								className='mr-2 h-4 md:ml-[-16px]'
							/>
							<Breadcrumbs />
						</div>
						<div className='px-4'>
							<ModeToggle />
						</div>
					</header>
					<div className='h-full gap-4 p-4 sm:pt-0 items-center w-full pt-10'>
						{children}
					</div>
				</SidebarInset>
				<DrawerMenu />
			</SidebarProvider>
		</div>
	);
}
