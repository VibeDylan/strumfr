import { Suspense } from "react";
import { FileText } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getPdfs } from "@/lib/data/pdfs";
import { UploadForm } from "@/components/library/upload-form";
import { PdfCard } from "@/components/library/pdf-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}

async function LibraryContent() {
  const { userId } = await verifySession();
  const pdfList = await getPdfs(userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Bibliothèque"
        description="Tes partitions et documents PDF"
      />

      <UploadForm />

      {pdfList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun PDF pour le moment"
          description="Ajoute une partition ci-dessus pour commencer"
        />
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
