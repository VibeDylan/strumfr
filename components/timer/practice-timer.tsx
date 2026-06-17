"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimerStore } from "@/lib/stores/timer-store";
import { createPracticeSession } from "@/lib/actions/practice";
import { practiceCategoryValues } from "@/lib/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  technique: "Technique",
  theorie: "Théorie",
  morceaux: "Morceaux",
  impro: "Improvisation",
  autre: "Autre",
};

const MILESTONES_MIN = [15, 30, 60];

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
    reachedMilestones,
    start,
    pause,
    resume,
    reset,
    setCategory,
    setNotes,
    markMilestone,
    getElapsedSec,
  } = useTimerStore();

  const [elapsed, setElapsed] = useState(getElapsedSec());
  const [isSaving, setIsSaving] = useState(false);
  const sessionStartRef = useRef<Date | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const sec = getElapsedSec();
      setElapsed(sec);

      for (const milestone of MILESTONES_MIN) {
        if (sec >= milestone * 60 && !reachedMilestones.includes(milestone)) {
          markMilestone(milestone);
          toast(`${milestone} minutes de pratique atteintes !`);
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [getElapsedSec, markMilestone, reachedMilestones]);

  function handleStart() {
    sessionStartRef.current = new Date();
    start();
  }

  async function handleStop() {
    const finalElapsed = getElapsedSec();
    if (finalElapsed < 1) {
      reset();
      return;
    }
    setIsSaving(true);
    try {
      await createPracticeSession({
        startedAt: sessionStartRef.current ?? new Date(),
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
      setElapsed(0);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="font-mono text-6xl tabular-nums sm:text-7xl">
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
          <Button size="lg" onClick={handleStart}>
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
    </div>
  );
}
