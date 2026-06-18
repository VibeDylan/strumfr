import { eq, and, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { pdfs, pdfShares } from "@/lib/db/schema";

export async function getAllPdfsForAdmin() {
  return db.select().from(pdfs).orderBy(desc(pdfs.uploadedAt));
}

export async function getSharedPdfsForEmail(email: string) {
  const shares = await db
    .select({ pdfId: pdfShares.pdfId })
    .from(pdfShares)
    .where(eq(pdfShares.email, email.toLowerCase()));

  const pdfIds = shares.map((s) => s.pdfId);
  if (pdfIds.length === 0) return [];

  return db
    .select()
    .from(pdfs)
    .where(inArray(pdfs.id, pdfIds))
    .orderBy(desc(pdfs.uploadedAt));
}

export async function getPdfShares(pdfId: string) {
  return db
    .select()
    .from(pdfShares)
    .where(eq(pdfShares.pdfId, pdfId))
    .orderBy(desc(pdfShares.createdAt));
}

export async function canAccessPdf(pdfId: string, email: string) {
  const rows = await db
    .select({ id: pdfShares.id })
    .from(pdfShares)
    .where(
      and(eq(pdfShares.pdfId, pdfId), eq(pdfShares.email, email.toLowerCase()))
    );
  return rows.length > 0;
}
