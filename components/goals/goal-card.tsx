"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toggleGoalCompleted, deleteGoal } from "@/lib/actions/goals";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  completedAt: Date | null;
};

export function GoalCard({ goal }: { goal: Goal }) {
  const [isPending, setIsPending] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsPending(true);
    try {
      await toggleGoalCompleted(goal.id, checked);
    } catch {
      toast.error("Erreur");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsPending(true);
    try {
      await deleteGoal(goal.id);
      toast.success("Objectif supprimé");
    } catch {
      toast.error("Erreur");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 py-4">
        <div className="space-y-1">
          <p
            className={
              goal.completedAt ? "font-medium line-through text-muted-foreground" : "font-medium"
            }
          >
            {goal.title}
          </p>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
          {goal.deadline && (
            <p className="text-xs text-muted-foreground">
              Échéance : {format(goal.deadline, "d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!goal.completedAt}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Supprimer"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
