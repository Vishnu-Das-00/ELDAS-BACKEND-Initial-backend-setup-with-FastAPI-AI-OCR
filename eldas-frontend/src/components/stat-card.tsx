import type { ReactNode } from "react";

import { Card } from "@/components/card";

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  accentClassName?: string;
}

export function StatCard({ label, value, helper, icon, accentClassName = "bg-tide/10 text-tide" }: StatCardProps) {
  return (
    <Card className="bg-white/90 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="mt-4 font-display text-4xl font-bold leading-none text-ink">{value}</p>
          {helper ? <p className="mt-3 max-w-[18rem] text-sm leading-6 text-slate-500">{helper}</p> : null}
        </div>
        {icon ? <div className={`rounded-2xl p-3 ${accentClassName}`}>{icon}</div> : null}
      </div>
    </Card>
  );
}
