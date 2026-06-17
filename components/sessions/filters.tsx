"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { practiceCategoryValues } from "@/lib/db/schema";
import { useTransition } from "react";

const CATEGORY_LABELS: Record<string, string> = {
  technique: "Technique",
  theorie: "Théorie",
  morceaux: "Morceaux",
  impro: "Improvisation",
  autre: "Autre",
};

export function SessionsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Rechercher dans les notes..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(v) => updateParam("category", v)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes catégories</SelectItem>
          {practiceCategoryValues.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
