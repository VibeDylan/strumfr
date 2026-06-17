"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPdf } from "@/lib/actions/pdfs";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const file = formData.get("file");
    if (file instanceof File && file.size > MAX_SIZE_BYTES) {
      toast.error("Le fichier dépasse 10 Mo");
      return;
    }
    setIsUploading(true);
    try {
      await uploadPdf(formData);
      toast.success("PDF ajouté");
      formRef.current?.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'upload");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="file">Fichier PDF (max 10 Mo)</Label>
        <Input id="file" name="file" type="file" accept="application/pdf" required />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="tags">Tags (séparés par virgule)</Label>
        <Input id="tags" name="tags" placeholder="partition, blues" />
      </div>
      <Button type="submit" disabled={isUploading}>
        <Upload className="mr-2 size-4" />
        {isUploading ? "Envoi..." : "Ajouter"}
      </Button>
    </form>
  );
}
