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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Flame, Target, Library, ListMusic } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function formatMinutes(sec: number) {
  return `${Math.round(sec / 60)} min`;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
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
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">Voici ton aperçu du jour</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pratique aujourd&apos;hui
            </CardTitle>
            <Timer className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatMinutes(todaySec)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Série en cours
            </CardTitle>
            <Flame className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {streak} jour{streak === 1 ? "" : "s"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prochain objectif
            </CardTitle>
            <Target className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {nearestGoal ? (
              <div className="space-y-1">
                <p className="font-medium">{nearestGoal.title}</p>
                {nearestGoal.deadline && (
                  <p className="text-xs text-muted-foreground">
                    {format(nearestGoal.deadline, "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun objectif en cours
              </p>
            )}
          </CardContent>
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Button
          render={
            <Link href="/timer">
              <Timer className="mr-2 size-4" /> Démarrer
            </Link>
          }
        />
        <Button
          variant="outline"
          render={
            <Link href="/library">
              <Library className="mr-2 size-4" /> Bibliothèque
            </Link>
          }
        />
        <Button
          variant="outline"
          render={
            <Link href="/repertoire">
              <ListMusic className="mr-2 size-4" /> Répertoire
            </Link>
          }
        />
        <Button
          variant="outline"
          render={
            <Link href="/goals">
              <Target className="mr-2 size-4" /> Objectifs
            </Link>
          }
        />
      </div>
    </div>
  );
}
