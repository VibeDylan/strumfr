"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pdfs, pdfShares } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const tagsSchema = z
  .string()
  .optional()
  .transform((v) =>
    v
      ? v
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : []
  );

const emailSchema = z.string().trim().toLowerCase().email();

export async function uploadPdf(formData: FormData) {
  const { userId, isAdmin } = await verifySession();
  if (!isAdmin) {
    throw new Error("Seul un administrateur peut ajouter des PDF");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Fichier manquant");
  }
  if (file.type !== "application/pdf") {
    throw new Error("Seuls les fichiers PDF sont acceptés");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Le fichier dépasse la limite de 10 Mo");
  }

  const tags = tagsSchema.parse(formData.get("tags") ?? undefined);

  const blob = await put(`pdfs/${userId}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "private",
  });

  await db.insert(pdfs).values({
    userId,
    name: file.name,
    blobUrl: blob.url,
    sizeBytes: file.size,
    tags,
  });

  revalidatePath("/library");
}

export async function deletePdf(id: string) {
  const { userId, isAdmin } = await verifySession();
  if (!isAdmin) {
    throw new Error("Seul un administrateur peut supprimer des PDF");
  }

  const rows = await db
    .select()
    .from(pdfs)
    .where(and(eq(pdfs.id, id), eq(pdfs.userId, userId)));
  const pdf = rows[0];
  if (!pdf) return;

  await del(pdf.blobUrl);
  await db.delete(pdfs).where(and(eq(pdfs.id, id), eq(pdfs.userId, userId)));

  revalidatePath("/library");
}

export async function sharePdf(pdfId: string, email: string) {
  const { isAdmin } = await verifySession();
  if (!isAdmin) {
    throw new Error("Seul un administrateur peut partager des PDF");
  }

  const cleanEmail = emailSchema.parse(email);

  await db
    .insert(pdfShares)
    .values({ pdfId, email: cleanEmail })
    .onConflictDoNothing();

  revalidatePath("/library");
}

export async function unsharePdf(pdfId: string, email: string) {
  const { isAdmin } = await verifySession();
  if (!isAdmin) {
    throw new Error("Seul un administrateur peut gérer les partages");
  }

  await db
    .delete(pdfShares)
    .where(and(eq(pdfShares.pdfId, pdfId), eq(pdfShares.email, email)));

  revalidatePath("/library");
}
