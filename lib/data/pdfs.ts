import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { pdfs } from "@/lib/db/schema";

export async function getPdfs(userId: string) {
  return db
    .select()
    .from(pdfs)
    .where(eq(pdfs.userId, userId))
    .orderBy(desc(pdfs.uploadedAt));
}
