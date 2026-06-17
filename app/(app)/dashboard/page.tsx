import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { verifySession } from "@/lib/dal";
import {
  getAllSessions,
  computeTodayDurationSec,
  computeStreak,
  computeHeatmap,
} from "@/lib/data/practice";
import { getNearestGoal } from "@/lib/data/goals";
import { ActivityHeatmap } from "@/components/stats/heatmap";
import { StatCard } from "@/components/stats/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Flame, Target, Library, ListMusic, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function formatMinutes(sec: number) {
  return `${Math.round(sec / 60)} min`;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const { userId, user } = await verifySession();
  const sessions = await getAllSessions(userId);
  const todaySec = computeTodayDurationSec(sessions);
  const streak = computeStreak(sessions);
  const heatmap = computeHeatmap(sessions, 365);
  const nearestGoal = await getNearestGoal(userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="hero-panel flex flex-col items-start justify-between gap-5 rounded-2xl border border-border p-7 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Voici ton aperçu du jour
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={
            <Link href="/timer">
              <Timer className="mr-2 size-4" /> Démarrer une session
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Timer}
          label="Pratique aujourd'hui"
          value={formatMinutes(todaySec)}
          variant="amber"
        />
        <StatCard
          icon={Flame}
          label="Série en cours"
          value={`${streak} jour${streak === 1 ? "" : "s"}`}
          variant="violet"
        />
        <Card className="gap-3">
          <div className="flex items-center justify-between px-5">
            <span className="text-[13px] font-medium text-muted-foreground">
              Prochain objectif
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-[color-mix(in_oklch,var(--chart-3),transparent_85%)] text-[var(--chart-3)]">
              <Target className="size-[18px]" />
            </div>
          </div>
          <div className="px-5">
            {nearestGoal ? (
              <>
                <p className="truncate text-lg font-bold tracking-tight">
                  {nearestGoal.title}
                </p>
                {nearestGoal.deadline && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format(nearestGoal.deadline, "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun objectif en cours
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité sur 365 jours</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={heatmap} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink href="/library" icon={Library} label="Bibliothèque" />
        <QuickLink href="/repertoire" icon={ListMusic} label="Répertoire" />
        <QuickLink href="/goals" icon={Target} label="Objectifs" />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Library;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-colors hover:bg-muted"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-[18px]" />
        </span>
        <span className="text-sm font-medium">{label}</span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
