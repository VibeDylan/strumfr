import { PracticeTimer } from "@/components/timer/practice-timer";
import { Metronome } from "@/components/timer/metronome";

export default function TimerPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Chrono de pratique</h1>
      <PracticeTimer />
      <Metronome />
    </div>
  );
}
