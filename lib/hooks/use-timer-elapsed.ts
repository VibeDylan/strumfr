"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/lib/stores/timer-store";

export function useTimerElapsed() {
  const isRunning = useTimerStore((s) => s.isRunning);
  const getElapsedSec = useTimerStore((s) => s.getElapsedSec);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(getElapsedSec());
    const id = window.setInterval(() => {
      setElapsed(getElapsedSec());
    }, 1000);
    return () => window.clearInterval(id);
  }, [getElapsedSec, isRunning]);

  return elapsed;
}
