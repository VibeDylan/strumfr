"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { repertoire, repertoireStatusValues } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

const repertoireSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().max(200).optional(),
  difficulty: z.coerce.number().int().min(1).max(5),
  status: z.enum(repertoireStatusValues),
  progress: z.coerce.number().int().min(0).max(100),
  notes: z.string().max(2000).optional(),
});

export async function createRepertoireItem(formData: FormData) {
  const { userId } = await verifySession();
  const data = repertoireSchema.parse({
    title: formData.get("title"),
    artist: formData.get("artist") || undefined,
    difficulty: formData.get("difficulty"),
    status: formData.get("status"),
    progress: formData.get("progress"),
    notes: formData.get("notes") || undefined,
  });

  await db.insert(repertoire).values({ userId, ...data });
  revalidatePath("/repertoire");
}

export async function updateRepertoireItem(id: string, formData: FormData) {
  const { userId } = await verifySession();
  const data = repertoireSchema.parse({
    title: formData.get("title"),
    artist: formData.get("artist") || undefined,
    difficulty: formData.get("difficulty"),
    status: formData.get("status"),
    progress: formData.get("progress"),
    notes: formData.get("notes") || undefined,
  });

  await db
    .update(repertoire)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(repertoire.id, id), eq(repertoire.userId, userId)));
  revalidatePath("/repertoire");
}

export async function deleteRepertoireItem(id: string) {
  const { userId } = await verifySession();
  await db
    .delete(repertoire)
    .where(and(eq(repertoire.id, id), eq(repertoire.userId, userId)));
  revalidatePath("/repertoire");
}
