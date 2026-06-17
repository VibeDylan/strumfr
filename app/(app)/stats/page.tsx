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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default async function StatsPage() {
  const { userId } = await verifySession();
  const sessions = await getAllSessions(userId);

  const weekData = computeGroupedTotals(sessions, "week");
  const monthData = computeGroupedTotals(sessions, "month");
  const yearData = computeGroupedTotals(sessions, "year");
  const categoryData = computeCategoryBreakdown(sessions);
  const heatmap = computeHeatmap(sessions, 365);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Statistiques</h1>

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
