"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RepertoireDialog } from "@/components/repertoire/repertoire-dialog";
import { deleteRepertoireItem } from "@/lib/actions/repertoire";

const STATUS_LABELS: Record<string, string> = {
  to_learn: "À apprendre",
  in_progress: "En cours",
  mastered: "Maîtrisé",
};

type RepertoireItem = {
  id: string;
  title: string;
  artist: string | null;
  difficulty: number;
  status: string;
  progress: number;
  notes: string | null;
};

export function RepertoireCard({ item }: { item: RepertoireItem }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteRepertoireItem(item.id);
      toast.success("Morceau supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{item.title}</CardTitle>
        {item.artist && (
          <p className="text-sm text-muted-foreground">{item.artist}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{STATUS_LABELS[item.status]}</Badge>
          <Badge variant="outline">Difficulté {item.difficulty}/5</Badge>
        </div>
        <Progress value={item.progress} />
      </CardContent>
      <CardFooter className="gap-2">
        <RepertoireDialog
          item={item}
          trigger={
            <Button variant="outline" size="sm" className="flex-1">
              <Pencil className="mr-2 size-3.5" /> Modifier
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Supprimer"
        >
          <Trash2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
