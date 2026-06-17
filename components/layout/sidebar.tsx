"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Guitar, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { navGroups } from "@/lib/nav-links";
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
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-[72px] items-center gap-3 px-5">
        <div className="brand-gradient flex size-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm">
          <Guitar className="size-[18px]" />
        </div>
        {!collapsed && (
          <span className="truncate text-[15px] font-bold tracking-tight text-sidebar-foreground">
            FollowGuitare
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pt-2">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">
                {group.label}
              </p>
            )}
            {group.links.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    active && "bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <Icon className="size-[17px] shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-1 border-t border-sidebar-border px-3 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Étendre" : "Réduire"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
        {!collapsed && (
          <div className="flex items-center gap-1">
            <ThemeToggle size="icon-sm" />
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                aria-label="Se déconnecter"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
