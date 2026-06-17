"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createJournalEntry } from "@/lib/actions/journal";
import { renderMarkdown } from "@/lib/markdown";

const MOODS = [
  { value: 1, emoji: "😞" },
  { value: 2, emoji: "🙁" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😄" },
];

export function JournalEditor() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const html = useMemo(() => renderMarkdown(content), [content]);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await createJournalEntry(formData);
      toast.success("Entrée ajoutée");
      setContent("");
      formRef.current?.reset();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(m.value)}
            className={`flex size-9 items-center justify-center rounded-full border text-lg transition-colors ${
              mood === m.value
                ? "border-primary bg-primary/15"
                : "border-border"
            }`}
            aria-label={`Humeur ${m.value}`}
          >
            {m.emoji}
          </button>
        ))}
        <input type="hidden" name="mood" value={mood} />
      </div>

      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write">Écrire</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="## Ce que j'ai pratiqué aujourd'hui..."
            required
          />
        </TabsContent>
        <TabsContent value="preview">
          <div
            className="markdown-preview min-h-[12rem] rounded-md border border-border p-3"
            dangerouslySetInnerHTML={{ __html: html || "<p class='text-muted-foreground'>Rien à afficher</p>" }}
          />
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Enregistrement..." : "Ajouter au journal"}
      </Button>
    </form>
  );
}
