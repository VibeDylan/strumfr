import { PracticeTimer } from "@/components/timer/practice-timer";
import { Metronome } from "@/components/timer/metronome";
import { PageHeader } from "@/components/layout/page-header";

export default function TimerPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Chrono"
        description="Démarre une session de pratique chronométrée"
      />
      <PracticeTimer />
      <Metronome />
    </div>
  );
}
