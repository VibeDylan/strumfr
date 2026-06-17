"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { renderMarkdown } from "@/lib/markdown";
import { deleteJournalEntry } from "@/lib/actions/journal";

const MOOD_EMOJI: Record<number, string> = {
  1: "😞",
  2: "🙁",
  3: "😐",
  4: "🙂",
  5: "😄",
};

type JournalEntry = {
  id: string;
  content: string;
  mood: number;
  createdAt: Date;
};

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteJournalEntry(entry.id);
      toast.success("Entrée supprimée");
    } catch {
      toast.error("Erreur");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-2 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{MOOD_EMOJI[entry.mood]}</span>
            <span className="text-xs text-muted-foreground">
              {format(entry.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Supprimer"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }}
        />
      </CardContent>
    </Card>
  );
}
