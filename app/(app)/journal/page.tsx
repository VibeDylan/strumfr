import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import { getJournalEntries } from "@/lib/data/journal";
import { JournalEditor } from "@/components/journal/journal-editor";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { NotebookPen } from "lucide-react";

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      }
    >
      <JournalContent />
    </Suspense>
  );
}

async function JournalContent() {
  const { userId } = await verifySession();
  const entries = await getJournalEntries(userId);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Journal"
        description="Tes notes et réflexions après chaque session"
      />

      <JournalEditor />

      <div className="space-y-3">
        {entries.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="Aucune entrée pour le moment"
            description="Écris ta première entrée ci-dessus"
          />
        ) : (
          entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
