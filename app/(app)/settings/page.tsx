import { verifySession } from "@/lib/dal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { DataExportImport } from "@/components/settings/data-export-import";

export default async function SettingsPage() {
  const { user } = await verifySession();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Réglages</h1>

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Thème clair / sombre
          </span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Données</CardTitle>
        </CardHeader>
        <CardContent>
          <DataExportImport />
        </CardContent>
      </Card>
    </div>
  );
}
