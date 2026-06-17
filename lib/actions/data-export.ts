"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  sessionsPractice,
  pdfs,
  repertoire,
  goals,
  journalEntries,
  practiceCategoryValues,
  repertoireStatusValues,
} from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

export async function exportData() {
  const { userId } = await verifySession();

  const [sessions, pdfList, repertoireList, goalsList, journal] =
    await Promise.all([
      db.select().from(sessionsPractice).where(eq(sessionsPractice.userId, userId)),
      db.select().from(pdfs).where(eq(pdfs.userId, userId)),
      db.select().from(repertoire).where(eq(repertoire.userId, userId)),
      db.select().from(goals).where(eq(goals.userId, userId)),
      db.select().from(journalEntries).where(eq(journalEntries.userId, userId)),
    ]);

  return {
    exportedAt: new Date().toISOString(),
    sessions,
    pdfs: pdfList,
    repertoire: repertoireList,
    goals: goalsList,
    journal,
  };
}

const importSchema = z.object({
  sessions: z
    .array(
      z.object({
        startedAt: z.coerce.date(),
        durationSec: z.number().int().min(1),
        category: z.enum(practiceCategoryValues),
        notes: z.string().nullable().optional(),
      })
    )
    .default([]),
  repertoire: z
    .array(
      z.object({
        title: z.string(),
        artist: z.string().nullable().optional(),
        difficulty: z.number().int().min(1).max(5),
        status: z.enum(repertoireStatusValues),
        progress: z.number().int().min(0).max(100),
        notes: z.string().nullable().optional(),
      })
    )
    .default([]),
  goals: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().nullable().optional(),
        deadline: z.coerce.date().nullable().optional(),
        completedAt: z.coerce.date().nullable().optional(),
      })
    )
    .default([]),
  journal: z
    .array(
      z.object({
        content: z.string(),
        mood: z.number().int().min(1).max(5),
      })
    )
    .default([]),
});

export async function importData(json: unknown) {
  const { userId } = await verifySession();
  const data = importSchema.parse(json);

  if (data.sessions.length > 0) {
    await db.insert(sessionsPractice).values(
      data.sessions.map((s) => ({ ...s, userId }))
    );
  }
  if (data.repertoire.length > 0) {
    await db.insert(repertoire).values(
      data.repertoire.map((r) => ({ ...r, userId }))
    );
  }
  if (data.goals.length > 0) {
    await db.insert(goals).values(data.goals.map((g) => ({ ...g, userId })));
  }
  if (data.journal.length > 0) {
    await db.insert(journalEntries).values(
      data.journal.map((j) => ({ ...j, userId }))
    );
  }
}
