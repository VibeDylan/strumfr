"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pdfs } from "@/lib/db/schema";
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

export async function uploadPdf(formData: FormData) {
  const { userId } = await verifySession();

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
  const { userId } = await verifySession();

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
