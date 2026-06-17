"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Quelque chose s'est mal passé."}
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
