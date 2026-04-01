import { LoaderCircle } from "lucide-react";

export function PageLoader({ label = "Loading your workspace..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-tide" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
