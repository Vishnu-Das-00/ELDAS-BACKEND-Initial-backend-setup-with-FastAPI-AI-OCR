import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/button";
import { Card } from "@/components/card";

interface ErrorPanelProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorPanel({ title = "Something went wrong", message, onRetry }: ErrorPanelProps) {
  return (
    <Card className="border-rose-100 bg-rose-50/60">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
          {onRetry ? (
            <Button className="mt-4" variant="danger" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
