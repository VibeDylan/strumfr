import { verifySession } from "@/lib/dal";
import { getJournalEntries } from "@/lib/data/journal";
import { JournalEditor } from "@/components/journal/journal-editor";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";

export default async function JournalPage() {
  const { userId } = await verifySession();
  const entries = await getJournalEntries(userId);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Journal de pratique</h1>

      <JournalEditor />

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune entrée pour le moment
          </p>
        ) : (
          entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
