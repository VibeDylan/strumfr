import { verifySession } from "@/lib/dal";
import { getAllGoals } from "@/lib/data/goals";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { GoalCard } from "@/components/goals/goal-card";

export default async function GoalsPage() {
  const { userId } = await verifySession();
  const goals = await getAllGoals(userId);
  const inProgress = goals.filter((g) => !g.completedAt);
  const completed = goals.filter((g) => g.completedAt);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Objectifs</h1>
        <GoalDialog />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          En cours ({inProgress.length})
        </h2>
        {inProgress.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun objectif en cours</p>
        ) : (
          inProgress.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Accomplis ({completed.length})
        </h2>
        {completed.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
