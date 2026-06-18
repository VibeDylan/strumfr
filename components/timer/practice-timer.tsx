"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimerStore } from "@/lib/stores/timer-store";
import { useTimerElapsed } from "@/lib/hooks/use-timer-elapsed";
import { createPracticeSession } from "@/lib/actions/practice";
import { practiceCategoryValues } from "@/lib/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  technique: "Technique",
  theorie: "Théorie",
  morceaux: "Morceaux",
  impro: "Improvisation",
  autre: "Autre",
};

function formatDuration(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function PracticeTimer() {
  const {
    isRunning,
    category,
    notes,
    sessionStartedAt,
    start,
    pause,
    resume,
    reset,
    setCategory,
    setNotes,
    getElapsedSec,
  } = useTimerStore();

  const elapsed = useTimerElapsed();
  const [isSaving, setIsSaving] = useState(false);

  async function handleStop() {
    const finalElapsed = getElapsedSec();
    if (finalElapsed < 1) {
      reset();
      return;
    }
    setIsSaving(true);
    try {
      await createPracticeSession({
        startedAt: sessionStartedAt ? new Date(sessionStartedAt) : new Date(),
        durationSec: finalElapsed,
        category,
        notes: notes || undefined,
      });
      toast.success("Session enregistrée");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
      reset();
    }
  }

  return (
    <Card className="hero-panel flex flex-col items-center gap-8 px-6 py-10">
      <div className="font-mono text-7xl font-medium tabular-nums sm:text-8xl">
        {formatDuration(elapsed)}
      </div>

      <div className="w-full max-w-sm space-y-1.5">
        <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {practiceCategoryValues.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full max-w-sm">
        <Textarea
          placeholder="Notes sur cette session..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-3">
        {!isRunning && elapsed === 0 && (
          <Button size="lg" onClick={start}>
            <Play className="mr-2 size-4" /> Démarrer
          </Button>
        )}
        {isRunning && (
          <Button size="lg" variant="secondary" onClick={pause}>
            <Pause className="mr-2 size-4" /> Pause
          </Button>
        )}
        {!isRunning && elapsed > 0 && (
          <Button size="lg" variant="secondary" onClick={resume}>
            <Play className="mr-2 size-4" /> Reprendre
          </Button>
        )}
        {elapsed > 0 && (
          <Button
            size="lg"
            variant="default"
            onClick={handleStop}
            disabled={isSaving}
          >
            <Square className="mr-2 size-4" /> Terminer
          </Button>
        )}
      </div>
    </Card>
  );
}
