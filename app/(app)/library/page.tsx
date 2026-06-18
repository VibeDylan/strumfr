import { Suspense } from "react";
import { FileText } from "lucide-react";
import { verifySession } from "@/lib/dal";
import {
  getAllPdfsForAdmin,
  getSharedPdfsForEmail,
  getPdfShares,
} from "@/lib/data/pdfs";
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
  const { isAdmin, user } = await verifySession();

  const pdfList = isAdmin
    ? await getAllPdfsForAdmin()
    : await getSharedPdfsForEmail(user.email ?? "");

  const sharesByPdf = isAdmin
    ? await Promise.all(
        pdfList.map(async (pdf) => ({
          pdfId: pdf.id,
          shares: await getPdfShares(pdf.id),
        }))
      )
    : [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Bibliothèque"
        description={
          isAdmin
            ? "Gère les partitions et qui peut y accéder"
            : "Les documents partagés avec toi"
        }
      />

      {isAdmin && <UploadForm />}

      {pdfList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            isAdmin
              ? "Aucun PDF pour le moment"
              : "Aucun document partagé avec toi pour le moment"
          }
          description={
            isAdmin ? "Ajoute une partition ci-dessus pour commencer" : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfList.map((pdf) => (
            <PdfCard
              key={pdf.id}
              pdf={pdf}
              isAdmin={isAdmin}
              shares={
                sharesByPdf.find((s) => s.pdfId === pdf.id)?.shares ?? []
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
