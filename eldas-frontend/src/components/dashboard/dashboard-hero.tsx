import type { ReactNode } from "react";

import { Badge } from "@/components/badge";
import { cn } from "@/lib/cn";
import type { DashboardTheme } from "@/types/theme";

interface HeroMetric {
  label: string;
  value: string;
}

interface DashboardHeroProps {
  theme: DashboardTheme;
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  metrics?: HeroMetric[];
  chips?: string[];
  action?: ReactNode;
  secondaryAction?: ReactNode;
}

export function DashboardHero({
  theme,
  eyebrow,
  title,
  description,
  icon,
  metrics = [],
  chips = [],
  action,
  secondaryAction,
}: DashboardHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/25 px-6 py-7 text-white shadow-panel md:px-8 md:py-8",
        "bg-gradient-to-br",
        theme.strongPanel,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
      <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{eyebrow}</p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight md:text-[2.65rem]">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">{description}</p>
            </div>
            {icon ? <div className={cn("hidden rounded-[1.6rem] p-4 md:block", theme.iconWrap)}>{icon}</div> : null}
          </div>

          {(action || secondaryAction) ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {action}
              {secondaryAction}
            </div>
          ) : null}

          {chips.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Badge key={chip} className="border border-white/15 bg-white/10 py-2 text-white">
                  {chip}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.6rem] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{metric.label}</p>
              <p className="mt-3 font-display text-3xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
