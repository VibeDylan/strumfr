"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function PracticeBarChart({
  data,
}: {
  data: { label: string; totalSec: number }[];
}) {
  const chartData = data.map((d) => ({
    label: d.label,
    minutes: Math.round(d.totalSec / 60),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--card-foreground)",
          }}
          formatter={(value: number) => [`${value} min`, "Pratique"]}
        />
        <Bar dataKey="minutes" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
