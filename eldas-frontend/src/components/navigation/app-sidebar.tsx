import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/cn";
import type { DashboardTheme } from "@/types/theme";
import type { NavigationItem } from "@/utils/navigation";

interface AppSidebarProps {
  items: NavigationItem[];
  theme: DashboardTheme;
}

export function AppSidebar({ items, theme }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col rounded-[2rem] border border-white/10 px-6 py-8 text-white shadow-panel lg:flex",
        theme.sidebar,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-3">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", theme.sidebarMuted)}>Eldas</p>
          <h1 className="font-display text-2xl font-bold">Learning signals</h1>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to !== "/notifications"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white",
                  isActive && theme.sidebarActive,
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-white/8 p-5">
        <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", theme.sidebarMuted)}>Vision</p>
        <p className="mt-3 text-sm leading-6 text-white/80">
          Turn classroom work into actionable insight for teachers, students, and families.
        </p>
      </div>
    </aside>
  );
}
