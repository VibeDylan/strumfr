import { Suspense } from "react";
import { Plus } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getRepertoire } from "@/lib/data/repertoire";
import { RepertoireCard } from "@/components/repertoire/repertoire-card";
import { RepertoireDialog } from "@/components/repertoire/repertoire-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <RepertoireContent />
    </Suspense>
  );
}

async function RepertoireContent() {
  const { userId } = await verifySession();
  const items = await getRepertoire(userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Répertoire</h1>
        <RepertoireDialog
          trigger={
            <Button>
              <Plus className="mr-2 size-4" /> Ajouter
            </Button>
          }
        />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun morceau pour le moment
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RepertoireCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
