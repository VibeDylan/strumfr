"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { goals } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

const goalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  deadline: z.coerce.date().optional(),
});

export async function createGoal(formData: FormData) {
  const { userId } = await verifySession();
  const data = goalSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    deadline: formData.get("deadline") || undefined,
  });

  await db.insert(goals).values({ userId, ...data });
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function toggleGoalCompleted(id: string, completed: boolean) {
  const { userId } = await verifySession();
  await db
    .update(goals)
    .set({ completedAt: completed ? new Date() : null })
    .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function deleteGoal(id: string) {
  const { userId } = await verifySession();
  await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}
