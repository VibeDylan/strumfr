import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Guitar } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Guitar className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold">FollowGuitare</h1>
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
          className="space-y-3"
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
      </div>
    </div>
  );
}
