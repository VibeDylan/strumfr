import { verifySession } from "@/lib/dal";
import { getAllSessions } from "@/lib/data/practice";
import { SessionsFilters } from "@/components/sessions/filters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CATEGORY_LABELS: Record<string, string> = {
  technique: "Technique",
  theorie: "Théorie",
  morceaux: "Morceaux",
  impro: "Improvisation",
  autre: "Autre",
};

const PAGE_SIZE = 20;

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;
  const { userId } = await verifySession();
  const sessions = await getAllSessions(userId);

  const filtered = sessions.filter((s) => {
    if (category && s.category !== category) return false;
    if (q && !(s.notes ?? "").toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Historique des sessions</h1>

      <SessionsFilters />

      <div className="space-y-3">
        {pageItems.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune session trouvée
          </p>
        )}
        {pageItems.map((session) => (
          <Card key={session.id}>
            <CardContent className="flex items-start justify-between gap-4 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[session.category]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(session.startedAt, "d MMMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                {session.notes && (
                  <p className="text-sm">{session.notes}</p>
                )}
              </div>
              <span className="font-mono text-sm tabular-nums">
                {Math.round(session.durationSec / 60)} min
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Page {currentPage} / {totalPages}
        </p>
      )}
    </div>
  );
}
