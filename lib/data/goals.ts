import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { goals } from "@/lib/db/schema";

export async function getNearestGoal(userId: string) {
  const rows = await db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), isNull(goals.completedAt)))
    .orderBy(asc(goals.deadline))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllGoals(userId: string) {
  return db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));
}
