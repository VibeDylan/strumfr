"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavLinks } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 flex border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
      {bottomNavLinks.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(link.href + "/");
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
              active && "text-primary"
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.25 : 2} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
