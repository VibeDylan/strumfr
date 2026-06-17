"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function CategoryPieChart({
  data,
}: {
  data: { label: string; totalSec: number }[];
}) {
  const chartData = data
    .filter((d) => d.totalSec > 0)
    .map((d) => ({ name: d.label, minutes: Math.round(d.totalSec / 60) }));

  if (chartData.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Pas encore de données
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="minutes"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => entry.name}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--card-foreground)",
          }}
          formatter={(value) => [`${value} min`, ""]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
