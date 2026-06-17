"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

const journalSchema = z.object({
  content: z.string().min(1).max(10000),
  mood: z.coerce.number().int().min(1).max(5),
});

export async function createJournalEntry(formData: FormData) {
  const { userId } = await verifySession();
  const data = journalSchema.parse({
    content: formData.get("content"),
    mood: formData.get("mood"),
  });

  await db.insert(journalEntries).values({ userId, ...data });
  revalidatePath("/journal");
}

export async function deleteJournalEntry(id: string) {
  const { userId } = await verifySession();
  await db
    .delete(journalEntries)
    .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  revalidatePath("/journal");
}
