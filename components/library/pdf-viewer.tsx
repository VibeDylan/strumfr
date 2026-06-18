"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-16 text-center text-xs text-muted-foreground">
            {pageNumber} / {numPages || "…"}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            aria-label="Page suivante"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            aria-label="Zoom -"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="min-w-12 text-center text-xs text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setScale((s) => Math.min(3, s + 0.2))}
            aria-label="Zoom +"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex max-h-[70vh] justify-center overflow-auto rounded-lg border border-border bg-background">
        <Document
          file={url}
          onLoadSuccess={(doc) => setNumPages(doc.numPages)}
          loading={
            <p className="p-6 text-sm text-muted-foreground">Chargement…</p>
          }
          error={
            <p className="p-6 text-sm text-destructive">
              Impossible de charger ce PDF
            </p>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>
    </div>
  );
}
