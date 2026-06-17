import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  amber: "bg-primary/10 text-primary",
  violet: "bg-violet/10 text-violet",
  teal: "bg-[color-mix(in_oklch,var(--chart-3),transparent_85%)] text-[color-mix(in_oklch,var(--chart-3),black_10%)] dark:text-[var(--chart-3)]",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  variant = "amber",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  return (
    <Card className="gap-3">
      <div className="flex items-center justify-between px-5">
        <span className="text-[13px] font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            VARIANT_CLASSES[variant]
          )}
        >
          <Icon className="size-[18px]" />
        </div>
      </div>
      <div className="px-5">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
