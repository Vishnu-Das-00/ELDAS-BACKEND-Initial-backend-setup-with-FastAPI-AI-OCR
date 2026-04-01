import { LogOut, Menu } from "lucide-react";

import { Button } from "@/components/button";
import { cn } from "@/lib/cn";
import { roleLabels } from "@/utils/roles";
import type { User } from "@/types/auth";
import type { DashboardTheme } from "@/types/theme";

interface AppHeaderProps {
  title: string;
  description: string;
  user: User;
  onMenuOpen: () => void;
  onLogout: () => void;
  theme: DashboardTheme;
}

export function AppHeader({ title, description, user, onMenuOpen, onLogout, theme }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 rounded-[2rem] border border-white/50 px-5 py-5 shadow-panel backdrop-blur-sm md:px-6",
        theme.shellAccent,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={onMenuOpen} className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="eyebrow">Workspace</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", theme.badge)}>
            {roleLabels[user.role]}
          </span>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
