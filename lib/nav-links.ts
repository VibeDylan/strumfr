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

export type NavGroup = {
  label: string;
  links: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Pratique",
    links: [
      { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/timer", label: "Chrono", icon: Timer },
      { href: "/stats", label: "Stats", icon: BarChart3 },
      { href: "/sessions", label: "Historique", icon: History },
    ],
  },
  {
    label: "Contenu",
    links: [
      { href: "/library", label: "Bibliothèque", icon: Library },
      { href: "/repertoire", label: "Répertoire", icon: ListMusic },
    ],
  },
  {
    label: "Suivi",
    links: [
      { href: "/goals", label: "Objectifs", icon: Target },
      { href: "/journal", label: "Journal", icon: NotebookPen },
    ],
  },
  {
    label: "Compte",
    links: [{ href: "/settings", label: "Réglages", icon: Settings }],
  },
];

export const navLinks: NavLink[] = navGroups.flatMap((g) => g.links);

export const bottomNavLinks: NavLink[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/timer", label: "Chrono", icon: Timer },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/library", label: "Biblio", icon: Library },
  { href: "/settings", label: "Réglages", icon: Settings },
];
