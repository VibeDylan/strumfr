import { Suspense } from "react";
import { Plus, ListMusic } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getRepertoire } from "@/lib/data/repertoire";
import { RepertoireCard } from "@/components/repertoire/repertoire-card";
import { RepertoireDialog } from "@/components/repertoire/repertoire-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10">
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
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Répertoire"
        description="Les morceaux que tu apprends ou as appris"
        actions={
          <RepertoireDialog
            trigger={
              <Button>
                <Plus className="mr-2 size-4" /> Ajouter
              </Button>
            }
          />
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={ListMusic}
          title="Aucun morceau pour le moment"
          description="Ajoute ton premier morceau pour suivre sa progression"
        />
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
