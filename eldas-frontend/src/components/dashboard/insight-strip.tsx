import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { cn } from "@/lib/cn";

interface InsightStripProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function InsightStrip({ title, description, icon, className }: InsightStripProps) {
  return (
    <Card className={cn("flex items-start gap-4 bg-white/88", className)}>
      {icon ? <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div> : null}
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </Card>
  );
}
