"use client";

type HeatmapEntry = { date: string; totalSec: number };

function intensityClass(totalSec: number) {
  if (totalSec <= 0) return "bg-muted";
  if (totalSec < 600) return "bg-primary/25";
  if (totalSec < 1800) return "bg-primary/50";
  if (totalSec < 3600) return "bg-primary/75";
  return "bg-primary";
}

export function ActivityHeatmap({ data }: { data: HeatmapEntry[] }) {
  const weeks: HeatmapEntry[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date} — ${Math.round(day.totalSec / 60)} min`}
                className={`size-2.5 rounded-sm ${intensityClass(day.totalSec)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
