import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

import { Button } from "@/components/button";
import { cn } from "@/lib/cn";
import type { DashboardTheme } from "@/types/theme";
import type { NavigationItem } from "@/utils/navigation";

interface MobileNavProps {
  open: boolean;
  items: NavigationItem[];
  onClose: () => void;
  theme: DashboardTheme;
}

export function MobileNav({ open, items, onClose, theme }: MobileNavProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden">
      <div className={cn("ml-auto flex h-full w-[84%] max-w-sm flex-col px-6 py-6 text-white", theme.sidebar)}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Eldas</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to !== "/notifications"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white",
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
      </div>
    </div>
  );
}
