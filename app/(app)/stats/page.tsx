import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import {
  getAllSessions,
  computeHeatmap,
  computeCategoryBreakdown,
  computeGroupedTotals,
} from "@/lib/data/practice";
import { ActivityHeatmap } from "@/components/stats/heatmap";
import { PracticeBarChart } from "@/components/stats/bar-chart";
import { CategoryPieChart } from "@/components/stats/category-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function StatsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <StatsContent />
    </Suspense>
  );
}

async function StatsContent() {
  const { userId } = await verifySession();
  const sessions = await getAllSessions(userId);

  const weekData = computeGroupedTotals(sessions, "week");
  const monthData = computeGroupedTotals(sessions, "month");
  const yearData = computeGroupedTotals(sessions, "year");
  const categoryData = computeCategoryBreakdown(sessions);
  const heatmap = computeHeatmap(sessions, 365);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Statistiques"
        description="Ton temps de pratique et ta progression dans le temps"
      />

      <Card>
        <CardHeader>
          <CardTitle>Temps de pratique</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week">
            <TabsList>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              <PracticeBarChart data={weekData} />
            </TabsContent>
            <TabsContent value="month">
              <PracticeBarChart data={monthData} />
            </TabsContent>
            <TabsContent value="year">
              <PracticeBarChart data={yearData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité (365 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={heatmap} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
