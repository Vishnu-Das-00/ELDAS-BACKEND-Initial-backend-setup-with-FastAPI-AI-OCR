import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/card";
import { formatPercent, titleCase } from "@/utils/format";

interface PerformanceBarChartProps {
  title: string;
  data: Record<string, number>;
}

const palette = ["#0f766e", "#f59e0b", "#ef6c57", "#155e75", "#1d4ed8", "#0f172a"];

export function PerformanceBarChart({ title, data }: PerformanceBarChartProps) {
  const rows = Object.entries(data).map(([key, value]) => ({
    key,
    label: titleCase(key),
    value,
  }));
  const average = rows.length ? rows.reduce((total, row) => total + row.value, 0) / rows.length : 0;

  return (
    <Card className="bg-white/92">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Analytics</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h3>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Average</p>
          <p className="mt-1 text-lg font-bold text-ink">{formatPercent(average)}</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbe7e7" />
            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickFormatter={formatPercent} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "rgba(15, 118, 110, 0.08)" }}
              formatter={(value: number) => formatPercent(value)}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 18px 40px -24px rgba(15,23,42,0.35)",
              }}
            />
            <Bar dataKey="value" radius={[16, 16, 0, 0]}>
              {rows.map((entry, index) => (
                <Cell key={entry.key} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
