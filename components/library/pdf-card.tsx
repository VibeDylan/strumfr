"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePdf } from "@/lib/actions/pdfs";
import { PdfViewer } from "@/components/library/pdf-viewer";
import { ShareDialog } from "@/components/library/share-dialog";
import { DraggableWindow } from "@/components/library/draggable-window";

type Pdf = {
  id: string;
  name: string;
  blobUrl: string;
  sizeBytes: number;
  tags: string[];
};

export function PdfCard({
  pdf,
  isAdmin = false,
  shares = [],
}: {
  pdf: Pdf;
  isAdmin?: boolean;
  shares?: { email: string }[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePdf(pdf.id);
      toast.success("PDF supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 shrink-0 text-primary" />
          <span className="truncate">{pdf.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {(pdf.sizeBytes / (1024 * 1024)).toFixed(2)} Mo
          {isAdmin &&
            ` · partagé avec ${shares.length} personne${shares.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {pdf.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setIsPreviewOpen(true)}
        >
          Aperçu
        </Button>
        {isAdmin && (
          <>
            <ShareDialog pdfId={pdf.id} pdfName={pdf.name} shares={shares} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Supprimer"
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
      </CardFooter>

      {isPreviewOpen && (
        <DraggableWindow title={pdf.name} onClose={() => setIsPreviewOpen(false)}>
          <PdfViewer url={`/api/pdfs/${pdf.id}`} />
        </DraggableWindow>
      )}
    </Card>
  );
}
