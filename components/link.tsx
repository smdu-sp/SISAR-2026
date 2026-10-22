'use client'

import NextLink, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";

export default function Link({ className, ...props }: LinkProps & React.HTMLAttributes<HTMLAnchorElement>) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const href = typeof props.href === "string" ? props.href : props.href.pathname?.toString() ?? "";
    const [hrefPathname, hrefQueryString] = href.split("?");
    const hrefSearchParams = new URLSearchParams(hrefQueryString);
    const hasQueryParams = Array.from(hrefSearchParams.keys()).length > 0;
    const isCurrentPath = pathname === hrefPathname && (
        hasQueryParams
            ? Array.from(hrefSearchParams.entries()).every(([key, value]) => searchParams.get(key) === value)
            : !searchParams.has("aba")
    );

    return <SidebarMenuButton asChild className={`transition-all ease-linear duration-200 ${
        isCurrentPath
          ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[inset_3px_0_0_var(--primary)]'
          : 'bg-transparent'
        } ${className}`}>
        <NextLink {...props} />
    </SidebarMenuButton>
}
