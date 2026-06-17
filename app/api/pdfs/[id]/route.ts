import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { get } from "@vercel/blob";
import { db } from "@/lib/db";
import { pdfs } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await verifySession();

  const rows = await db
    .select()
    .from(pdfs)
    .where(and(eq(pdfs.id, id), eq(pdfs.userId, userId)));
  const pdf = rows[0];
  if (!pdf) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await get(pdf.blobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(pdf.name)}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
