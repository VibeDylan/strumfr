import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Guitar, Timer, BarChart3, Library } from "lucide-react";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="hero-panel flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="brand-gradient flex size-16 items-center justify-center rounded-2xl text-primary-foreground shadow-md">
          <Guitar className="size-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          FollowGuitare
        </h1>
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

      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/login">Commencer</Link>}
      />
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
    <Card className="flex-row items-center gap-3 px-5 py-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <span className="text-sm font-medium text-card-foreground">
        {label}
      </span>
    </Card>
  );
}
