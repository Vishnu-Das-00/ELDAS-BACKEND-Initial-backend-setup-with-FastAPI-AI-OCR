import type { ReactNode } from "react";

import { Card } from "@/components/card";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed text-center">
      <p className="eyebrow">Nothing here yet</p>
      <h3 className="mt-3 font-display text-2xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
