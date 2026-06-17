import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessionsPractice, type PracticeCategory } from "@/lib/db/schema";

export type PracticeSession = {
  id: string;
  startedAt: Date;
  durationSec: number;
  category: PracticeCategory;
  notes: string | null;
};

export async function getAllSessions(
  userId: string
): Promise<PracticeSession[]> {
  return db
    .select({
      id: sessionsPractice.id,
      startedAt: sessionsPractice.startedAt,
      durationSec: sessionsPractice.durationSec,
      category: sessionsPractice.category,
      notes: sessionsPractice.notes,
    })
    .from(sessionsPractice)
    .where(eq(sessionsPractice.userId, userId))
    .orderBy(desc(sessionsPractice.startedAt));
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function computeTodayDurationSec(sessions: PracticeSession[]) {
  const today = dayKey(new Date());
  return sessions
    .filter((s) => dayKey(s.startedAt) === today)
    .reduce((sum, s) => sum + s.durationSec, 0);
}

export function computeStreak(sessions: PracticeSession[]) {
  const days = new Set(sessions.map((s) => dayKey(s.startedAt)));
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = dayKey(cursor);
    if (!days.has(key)) {
      if (streak === 0 && key === dayKey(new Date())) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeHeatmap(sessions: PracticeSession[], days = 365) {
  const totals = new Map<string, number>();
  for (const s of sessions) {
    const key = dayKey(s.startedAt);
    totals.set(key, (totals.get(key) ?? 0) + s.durationSec);
  }

  const result: { date: string; totalSec: number }[] = [];
  const cursor = new Date();
  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor);
    result.unshift({ date: key, totalSec: totals.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() - 1);
  }
  return result;
}

const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  technique: "Technique",
  theorie: "Théorie",
  morceaux: "Morceaux",
  impro: "Improvisation",
  autre: "Autre",
};

export function computeCategoryBreakdown(sessions: PracticeSession[]) {
  const totals = new Map<PracticeCategory, number>();
  for (const s of sessions) {
    totals.set(s.category, (totals.get(s.category) ?? 0) + s.durationSec);
  }
  return Array.from(totals.entries()).map(([category, totalSec]) => ({
    category,
    label: CATEGORY_LABELS[category],
    totalSec,
  }));
}

export type Granularity = "week" | "month" | "year";

export function computeGroupedTotals(
  sessions: PracticeSession[],
  granularity: Granularity
) {
  if (granularity === "week") {
    const result: { label: string; totalSec: number }[] = [];
    const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const cursor = new Date();
    const dayOfWeek = (cursor.getDay() + 6) % 7;
    cursor.setDate(cursor.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
      const key = dayKey(cursor);
      const totalSec = sessions
        .filter((s) => dayKey(s.startedAt) === key)
        .reduce((sum, s) => sum + s.durationSec, 0);
      result.push({ label: labels[i], totalSec });
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }

  if (granularity === "month") {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const result: { label: string; totalSec: number }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const key = dayKey(date);
      const totalSec = sessions
        .filter((s) => dayKey(s.startedAt) === key)
        .reduce((sum, s) => sum + s.durationSec, 0);
      result.push({ label: String(day), totalSec });
    }
    return result;
  }

  // year: group by month
  const labels = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const now = new Date();
  const result: { label: string; totalSec: number }[] = [];
  for (let month = 0; month < 12; month++) {
    const totalSec = sessions
      .filter(
        (s) =>
          s.startedAt.getFullYear() === now.getFullYear() &&
          s.startedAt.getMonth() === month
      )
      .reduce((sum, s) => sum + s.durationSec, 0);
    result.push({ label: labels[month], totalSec });
  }
  return result;
}
