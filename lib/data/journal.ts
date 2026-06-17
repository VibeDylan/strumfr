import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";

export async function getJournalEntries(userId: string) {
  return db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt));
}
