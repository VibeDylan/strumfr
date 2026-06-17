"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createRepertoireItem,
  updateRepertoireItem,
} from "@/lib/actions/repertoire";

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

export function RepertoireDialog({
  item,
  trigger,
}: {
  item?: RepertoireItem;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      if (item) {
        await updateRepertoireItem(item.id, formData);
      } else {
        await createRepertoireItem(formData);
      }
      toast.success("Morceau enregistré");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? "Modifier le morceau" : "Ajouter un morceau"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              defaultValue={item?.title}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="artist">Artiste</Label>
            <Input id="artist" name="artist" defaultValue={item?.artist ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="difficulty">Difficulté (1-5)</Label>
              <Input
                id="difficulty"
                name="difficulty"
                type="number"
                min={1}
                max={5}
                defaultValue={item?.difficulty ?? 1}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={item?.progress ?? 0}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={item?.status ?? "to_learn"}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={item?.notes ?? ""} />
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
