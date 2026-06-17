import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { Guitar, Timer, BarChart3, Library } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-background px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Guitar className="size-7" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">FollowGuitare</h1>
        <p className="max-w-md text-muted-foreground">
          Suis tes sessions de pratique, ton répertoire, tes objectifs et ta
          progression à la guitare — depuis n&apos;importe quel appareil.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Feature icon={Timer} label="Chrono & métronome" />
        <Feature icon={BarChart3} label="Stats & heatmap" />
        <Feature icon={Library} label="Bibliothèque PDF" />
      </div>

      <Button size="lg" render={<Link href="/login">Commencer</Link>} />
    </main>
  );
}

function Feature({
  icon: Icon,
  label,
}: {
  icon: typeof Timer;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4">
      <Icon className="size-5 text-primary" />
      <span className="text-sm text-card-foreground">{label}</span>
    </div>
  );
}
