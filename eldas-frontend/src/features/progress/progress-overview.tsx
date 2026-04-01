import { Card } from "@/components/card";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { formatPercent, titleCase } from "@/utils/format";
import type { ProgressRecord } from "@/types/progress";

interface ProgressOverviewProps {
  progress: ProgressRecord[];
}

export function ProgressOverview({ progress }: ProgressOverviewProps) {
  if (!progress.length) {
    return null;
  }

  const trendData = progress.map((record) => ({
    label: record.subject,
    score: record.skill_scores.averages?.understanding ?? 0,
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <ProgressLineChart title="Understanding by subject" data={trendData} />
      <Card>
        <p className="eyebrow">Breakdown</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-ink">Skill averages</h3>
        <div className="mt-6 space-y-4">
          {progress.map((record) => (
            <div key={record.subject} className="rounded-2xl bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold text-ink">{record.subject}</h4>
                <span className="text-xs text-slate-400">{record.skill_scores.attempts ?? 0} attempts</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                {Object.entries(record.skill_scores.averages ?? {}).map(([key, value]) => {
                  if (typeof value === "object" || value === undefined) {
                    return null;
                  }
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span>{titleCase(key)}</span>
                      <strong>{formatPercent(value)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
