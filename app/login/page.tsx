import { Suspense } from "react";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Guitar } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="hero-panel flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 px-6 pb-2 text-center">
          <div className="brand-gradient flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-md">
            <Guitar className="size-6" />
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            FollowGuitare
          </h1>
          <p className="text-sm text-muted-foreground">
            Connecte-toi pour suivre ta pratique
          </p>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", {
              email: formData.get("email"),
              redirectTo: callbackUrl ?? "/dashboard",
            });
          }}
          className="space-y-3 px-6 pb-6 pt-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="toi@exemple.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Recevoir un lien de connexion
          </Button>
        </form>
      </Card>
    </div>
  );
}
