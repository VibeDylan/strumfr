"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { createGoal } from "@/lib/actions/goals";

export function GoalDialog() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await createGoal(formData);
      toast.success("Objectif créé");
      formRef.current?.reset();
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 size-4" /> Nouvel objectif
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel objectif</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline">Échéance</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Création..." : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
