import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Timer,
  BarChart3,
  History,
  Library,
  ListMusic,
  Target,
  NotebookPen,
  Settings,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/timer", label: "Chrono", icon: Timer },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/sessions", label: "Historique", icon: History },
  { href: "/library", label: "Bibliothèque", icon: Library },
  { href: "/repertoire", label: "Répertoire", icon: ListMusic },
  { href: "/goals", label: "Objectifs", icon: Target },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/settings", label: "Réglages", icon: Settings },
];

export const bottomNavLinks: NavLink[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/timer", label: "Chrono", icon: Timer },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/library", label: "Biblio", icon: Library },
  { href: "/settings", label: "Réglages", icon: Settings },
];
