"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Guitar, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { navLinks } from "@/lib/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Guitar className="size-4" />
        </div>
        {!collapsed && (
          <span className="truncate font-semibold text-sidebar-foreground">
            FollowGuitare
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {navLinks.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Étendre" : "Réduire"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
        {!collapsed && <ThemeToggle />}
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Se déconnecter"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
