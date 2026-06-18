"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PracticeCategory } from "@/lib/db/schema";

type TimerState = {
  isRunning: boolean;
  startedAt: number | null;
  sessionStartedAt: number | null;
  elapsedBeforePauseSec: number;
  category: PracticeCategory;
  notes: string;
  reachedMilestones: number[];
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setCategory: (category: PracticeCategory) => void;
  setNotes: (notes: string) => void;
  markMilestone: (minutes: number) => void;
  getElapsedSec: () => number;
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startedAt: null,
      sessionStartedAt: null,
      elapsedBeforePauseSec: 0,
      category: "technique",
      notes: "",
      reachedMilestones: [],

      start: () =>
        set({
          isRunning: true,
          startedAt: Date.now(),
          sessionStartedAt: Date.now(),
          elapsedBeforePauseSec: 0,
          reachedMilestones: [],
        }),

      pause: () => {
        const state = get();
        set({
          isRunning: false,
          elapsedBeforePauseSec: state.getElapsedSec(),
          startedAt: null,
        });
      },

      resume: () =>
        set({
          isRunning: true,
          startedAt: Date.now(),
        }),

      reset: () =>
        set({
          isRunning: false,
          startedAt: null,
          sessionStartedAt: null,
          elapsedBeforePauseSec: 0,
          notes: "",
          reachedMilestones: [],
        }),

      setCategory: (category) => set({ category }),
      setNotes: (notes) => set({ notes }),
      markMilestone: (minutes) =>
        set((state) => ({
          reachedMilestones: [...state.reachedMilestones, minutes],
        })),

      getElapsedSec: () => {
        const state = get();
        if (!state.isRunning || state.startedAt === null) {
          return state.elapsedBeforePauseSec;
        }
        return (
          state.elapsedBeforePauseSec +
          Math.floor((Date.now() - state.startedAt) / 1000)
        );
      },
    }),
    {
      name: "followguitare-timer",
    }
  )
);
