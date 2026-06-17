"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportData, importData } from "@/lib/actions/data-export";

export function DataExportImport() {
  const [isWorking, setIsWorking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setIsWorking(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `followguitare-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export terminé");
    } catch {
      toast.error("Erreur lors de l'export");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleImportFile(file: File) {
    setIsWorking(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await importData(json);
      toast.success("Import terminé");
    } catch {
      toast.error("Erreur lors de l'import — vérifie le format du fichier");
    } finally {
      setIsWorking(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button onClick={handleExport} disabled={isWorking} variant="outline">
        <Download className="mr-2 size-4" /> Exporter mes données (JSON)
      </Button>
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isWorking}
        variant="outline"
      >
        <Upload className="mr-2 size-4" /> Importer un export JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
        }}
      />
    </div>
  );
}
