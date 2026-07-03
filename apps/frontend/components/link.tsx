'use client'

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";

export default function Link({ className, ...props }: LinkProps & React.HTMLAttributes<HTMLAnchorElement>) {
    const pathname = usePathname();
    const isCurrentPath = pathname === props.href;
    return <SidebarMenuButton asChild className={`transition-all ease-linear duration-200 ${
        isCurrentPath
          ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[inset_3px_0_0_var(--primary)]'
          : 'bg-transparent'
        } ${className}`}>
        <NextLink {...props} />
    </SidebarMenuButton>
}