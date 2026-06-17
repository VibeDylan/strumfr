import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MiniTimerBar } from "@/components/timer/mini-timer-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </div>
      <MiniTimerBar />
    </div>
  );
}
