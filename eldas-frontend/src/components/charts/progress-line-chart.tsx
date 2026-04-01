import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/card";
import { formatPercent } from "@/utils/format";

interface ProgressLineChartProps {
  title: string;
  data: Array<{
    label: string;
    score: number;
  }>;
}

export function ProgressLineChart({ title, data }: ProgressLineChartProps) {
  const best = data.length ? Math.max(...data.map((item) => item.score)) : 0;

  return (
    <Card className="bg-white/92">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Trend</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h3>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Best subject</p>
          <p className="mt-1 text-lg font-bold text-ink">{formatPercent(best)}</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbe7e7" />
            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickFormatter={formatPercent} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => formatPercent(value)}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 18px 40px -24px rgba(15,23,42,0.35)",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0f766e" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
