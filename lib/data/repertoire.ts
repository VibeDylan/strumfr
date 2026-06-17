import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { repertoire } from "@/lib/db/schema";

export async function getRepertoire(userId: string) {
  return db
    .select()
    .from(repertoire)
    .where(eq(repertoire.userId, userId))
    .orderBy(desc(repertoire.updatedAt));
}
