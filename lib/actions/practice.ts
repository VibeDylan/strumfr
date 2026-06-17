"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sessionsPractice, practiceCategoryValues } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

const createSessionSchema = z.object({
  startedAt: z.coerce.date(),
  durationSec: z.coerce.number().int().min(1),
  category: z.enum(practiceCategoryValues),
  notes: z.string().max(2000).optional(),
});

export async function createPracticeSession(input: {
  startedAt: Date;
  durationSec: number;
  category: string;
  notes?: string;
}) {
  const { userId } = await verifySession();
  const data = createSessionSchema.parse(input);

  await db.insert(sessionsPractice).values({
    userId,
    startedAt: data.startedAt,
    durationSec: data.durationSec,
    category: data.category,
    notes: data.notes,
  });

  revalidatePath("/dashboard");
  revalidatePath("/stats");
  revalidatePath("/sessions");
}
