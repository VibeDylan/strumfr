import { verifySession } from "@/lib/dal";
import { getPdfs } from "@/lib/data/pdfs";
import { UploadForm } from "@/components/library/upload-form";
import { PdfCard } from "@/components/library/pdf-card";

export default async function LibraryPage() {
  const { userId } = await verifySession();
  const pdfList = await getPdfs(userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Bibliothèque</h1>

      <UploadForm />

      {pdfList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun PDF pour le moment
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfList.map((pdf) => (
            <PdfCard key={pdf.id} pdf={pdf} />
          ))}
        </div>
      )}
    </div>
  );
}
