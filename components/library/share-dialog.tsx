"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { sharePdf, unsharePdf } from "@/lib/actions/pdfs";

export function ShareDialog({
  pdfId,
  pdfName,
  shares,
}: {
  pdfId: string;
  pdfName: string;
  shares: { email: string }[];
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  async function handleAdd() {
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await sharePdf(pdfId, email);
      toast.success("Accès accordé");
      setEmail("");
    } catch {
      toast.error("Email invalide ou erreur");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(shareEmail: string) {
    setPendingEmail(shareEmail);
    try {
      await unsharePdf(pdfId, shareEmail);
      toast.success("Accès retiré");
    } catch {
      toast.error("Erreur");
    } finally {
      setPendingEmail(null);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Gérer le partage">
            <Users className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager « {pdfName} »</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button onClick={handleAdd} disabled={isSubmitting}>
            Ajouter
          </Button>
        </div>

        <div className="space-y-2">
          {shares.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Personne n&apos;a accès pour le moment
            </p>
          ) : (
            shares.map((share) => (
              <div
                key={share.email}
                className="flex items-center justify-between rounded-md border border-border px-3 py-1.5"
              >
                <Badge variant="secondary">{share.email}</Badge>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(share.email)}
                  disabled={pendingEmail === share.email}
                  aria-label="Retirer l'accès"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
