"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Pause, Play, Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/lib/stores/timer-store";
import { useTimerElapsed } from "@/lib/hooks/use-timer-elapsed";

const MILESTONES_MIN = [15, 30, 60];

function formatDuration(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function MiniTimerBar() {
  const pathname = usePathname();
  const isRunning = useTimerStore((s) => s.isRunning);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const start = useTimerStore((s) => s.start);
  const reachedMilestones = useTimerStore((s) => s.reachedMilestones);
  const markMilestone = useTimerStore((s) => s.markMilestone);
  const elapsed = useTimerElapsed();

  useEffect(() => {
    for (const milestone of MILESTONES_MIN) {
      if (elapsed >= milestone * 60 && !reachedMilestones.includes(milestone)) {
        markMilestone(milestone);
        toast(`${milestone} minutes de pratique atteintes !`);
      }
    }
  }, [elapsed, reachedMilestones, markMilestone]);

  if (pathname === "/timer") return null;

  const hasSession = elapsed > 0 || isRunning;

  return (
    <div className="fixed bottom-[88px] right-4 z-40 md:bottom-6">
      {hasSession ? (
        <div className="flex items-center gap-2 rounded-full border border-border bg-card py-3 pl-5 pr-2.5 shadow-xl">
          <Link
            href="/timer"
            className="flex items-center gap-3 text-lg font-semibold"
          >
            <TimerIcon
              className={`size-5 ${isRunning ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className="font-mono tabular-nums">
              {formatDuration(elapsed)}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={isRunning ? pause : resume}
            aria-label={isRunning ? "Mettre en pause" : "Reprendre"}
          >
            {isRunning ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full shadow-xl"
          onClick={() => start()}
        >
          <Play className="mr-2 size-4" /> Démarrer
        </Button>
      )}
    </div>
  );
}
