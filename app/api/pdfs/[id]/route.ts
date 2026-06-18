import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { get } from "@vercel/blob";
import { db } from "@/lib/db";
import { pdfs } from "@/lib/db/schema";
import { verifySession } from "@/lib/dal";
import { canAccessPdf } from "@/lib/data/pdfs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { isAdmin, user } = await verifySession();

  const rows = await db.select().from(pdfs).where(eq(pdfs.id, id));
  const pdf = rows[0];
  if (!pdf) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed =
    isAdmin || (user.email ? await canAccessPdf(id, user.email) : false);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
