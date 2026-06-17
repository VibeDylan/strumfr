import { verifySession } from "@/lib/dal";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
